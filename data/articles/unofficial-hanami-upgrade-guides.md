---
id: 10
aliases: ["HMAP010"]
author: "swilgosz"
topics: ['hanami', 'rom']
title: "WIP: Unofficial guide for upgrading Hanami 1.x -> Hanami 2.x"
excerpt: "When there is a complete framework rewrite, upgrading may be tricky, and it definitely is this time. Hope this guide will help you save some headache during upgrading on the hardest shift ever."
publishedAt: "2023-06-14"
modifiedAt: "2022-06-14"
published: true
thumbnail:
  full: /images/articles/unofficial-hanami-upgrade-guides/cover-full.jpeg
  big: /images/articles/unofficial-hanami-upgrade-guides/cover-big.jpeg
  small: /images/articles/unofficial-hanami-upgrade-guides/cover-small.jpeg
source: https://github.com/hanamimastery/episodes/tree/main/001
category: stray
---

:::warning
This is an unofficial, community-maintained guide to help upgrading projects that are built on Hanami 1.x to Hanami 2.x. [To contribute, fork our repo and create PR](https://github.com/swilgosz/hanamimastery/blob/master/data/articles/nofficial-hanami-upgrade-guides.md).
:::

:::info
This is work-in-progress guide, if you see this valuable, [consider support](https://github.com/sponsors/swilgosz) or [contribution](https://github.com/swilgosz/hanamimastery/fork) to speed up the completion.
:::

:::info
Hanami 2 is an almost complete framework rewrite, which makes upgrading projects uncommonly hard. However, it’s important to say, that the core team states there won’t be any such major rewrites of the framework in the future, and the official upgrade guides will be available.
:::


This document was created as a result of combined work of [Ascenda developers](https://ascendaloyalty.com), after upgrading multiple services of various sizes. Based on our experience, here are our thoughts.

Special thanks to [Ng Chen Hon](https://github.com/MutatedBread), [Hieu Nguyen](https://github.com/hieuk09) and [Sebastian Wilgosz](https://bio.link/swilgosz) for all the initial exploration.

---

# 1. Small Applications

If you have very small application, **consider creating a brand new Hanami 2 application**, with views and persistence in place, and just copy your code there.

:::tip
You can use [HanamiSmith to spin such quickly](https://hanamimastery.com/episodes/40-hanamismith), or refer to the [Sean Colins' sample PR](https://github.com/hanami/bookshelf/pull/15) to upgrade it all at once
:::

# 2. Medium-size applications

If you have medium-size application, without crazy custom monkey patches or wrappers on your gems or hanami itself, consider doing it in 3 steps.

1. Upgrade ROM to 5.0 and get rid of Hanami-Model
2. Upgrade Ruby to 3.x
3. Upgrade Hanami to 2.x

**Reasons:**

- Hanami 1.x requires Ruby < 3, while Hanami 2.x requires Ruby > 3
- Hanami Model requires Ruby < 3, <= ROM 3.3
- Hanami Utils requires Ruby < 3

## 2.1 Prepare app for ROM 5 upgrade

Upgrading ROM is a big task on it's own, so in the next section we split this even further. Below you can list the steps we extracted first before the actual switch of Hanami-Model -> ROM 5.0

1. Update all gems to the latest possible versions.
2. Increase the test coverage as much as possible - In our projects we aimed to ~85-95% [branch test coverage](https://hanamimastery.com/episodes/25-simplecov-introduction).
3. Upgrade migrations to use ROM directly

### Upgrade migrations to use ROM directly

#### Move migrations to the `db/migrate` folder

```ruby
# config/environment.rb

##
# Migrations
#
# THEN
migrations 'db/migrations'

# NOW
migrations 'db/migrate'
```

#### Add minor tweaks for migrations to use ROM directly.

Here are some notes on syntax change:

```ruby
# THEN
Hanami::Model.migration do
# NOW
ROM::SQL.migration do

# NOW we use UUID as primary keys in most tables
execute 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"'

# THEN
primary_key :id

# NOW
column :id, 'serial', primary_key: true, null: false


# THEN
primary_key :id

# NOW
column :id, 'serial', primary_key: true, null: false
```

#### Add rake tasks for DB management (copied from ROM)

We have added a new rake file, for db-related tasks, that we could customize further in the future. This is a subject to be removed after successful update finishes.

```ruby
# rakelib/db.rake

require 'rom'
require 'dotenv/tasks'
require 'dotenv'
require 'open3'

class MigrationError < StandardError
end

class DbTaskHelper
  class << self

    HOST         = 'PGHOST'.freeze
    PORT         = 'PGPORT'.freeze
    USER         = 'PGUSER'.freeze
    PASSWORD     = 'PGPASSWORD'.freeze
    DATABASE_URL = 'DATABASE_URL'.freeze

    def set_environment_variables # rubocop:disable Metrics/AbcSize
      ENV[HOST]     = host      unless host.nil?
      ENV[PORT]     = port.to_s unless port.nil?
      ENV[PASSWORD] = password  unless password.nil?
      ENV[USER]     = username  unless username.nil?
    end

    def call_db_command(command, *flags)
      Open3.popen3(*command_with_credentials(command, flags)) do |_stdin, _stdout, stderr, wait_thr|
        raise MigrationError, stderr.read unless wait_thr.value.success? # wait_thr.value is the exit status
      end
    rescue SystemCallError => e
      raise MigrationError, e.message
    end

    private

      def database_url
        @database_url ||= URI.parse(ENV.fetch(DATABASE_URL, nil))
      end

      def host
        database_url.host
      end

      def port
        database_url.port
      end

      def username
        database_url.user
      end

      def password
        database_url.password
      end

      def database
        database_url.path[1..]
      end

      def connection
        Sequel.connect(database_url.to_s)
      end

      def command_with_credentials(command, flags = [])
        result = [escape(command)]
        result << "--host=#{host}" if host
        result << "--port=#{port}" if port
        result << "--username=#{username}" if username
        result << '--no-password'
        flags.map { |f| result << f }
        result << database

        result.compact
      end

      def escape(string)
        Shellwords.escape(string) unless string.nil?
      end
  end
end

require 'pathname'
require 'fileutils'

module ROM
  module SQL
    module RakeSupport
      MissingEnv = Class.new(StandardError)

      class << self
        def run_migrations(options = {})
          gateway.run_migrations(options)
          return unless ENV['HANAMI_ENV'] == 'development'

          system("pg_dump -s --no-owner --no-privileges #{ENV.fetch('DATABASE_URL')} > db/structure.sql")
        end

        def create_migration(*args)
          gateway.migrator.create_file(*args)
        end

        # Global environment used for running migrations. You normally
        # set in the `db:setup` task with `ROM::SQL::RakeSupport.env = ROM.container(...)`
        # or something similar.
        #
        # @api public
        attr_accessor :env

        private

          def gateway
            if env.nil? # rubocop:disable Style/GuardClause
              Gateway.instance ||
                raise(MissingEnv, 'Set up a configutation with ROM::SQL::RakeSupport.env= in the db:setup task')
            else
              env.gateways[:default]
            end
          end
      end

      @env = nil
    end
  end
end

# Copied from ROM
namespace :db do # rubocop:disable Metrics/BlockLength
  task :create do
    DbTaskHelper.set_environment_variables

    begin
      DbTaskHelper.call_db_command('createdb')
    rescue MigrationError => e
      puts e.message
    end
  end

  task :setup do
    ROM::SQL::RakeSupport.env =
      ROM::Configuration.new(
        :sql,
        ENV.fetch('DATABASE_URL'),
        logger: Hanami.logger,
        extensions: %i(pg_array pg_json)
      )
  end

  desc 'Create database and run migrations'
  task prepare: %i(create migrate)

  desc 'Drop database'
  task :drop do
    DbTaskHelper.set_environment_variables

    DbTaskHelper.call_db_command('dropdb')
  end

  desc 'Rollback migration (options [step])'
  task :rollback, [:step] => :environment do |_, args|
    Rake::Task['db:setup'].invoke

    step = (args[:step] || 1).to_i

    # Reference: https://github.com/jeremyevans/sequel/blob/d9104d2cf0611f749a16fe93c4171a1147dfd4b2/lib/sequel/extensions/migration.rb#L598
    if step >= 20_000_101
      ROM::SQL::RakeSupport.run_migrations(target: step)
      puts "<= db:rollback version=[#{step}] executed"
      exit
    end

    gateway = ROM::SQL::RakeSupport.env.gateways[:default]
    unless gateway.dataset?(:schema_migrations)
      puts '<= db:rollback failed due to missing schema_migrations'
      exit 0
    end

    schema_migrations = gateway.dataset(:schema_migrations).all
    versions =
      schema_migrations
        .sort_by { |s| s[:filename] }
        .reverse
        .map { |s| s[:filename].split('_').first }

    versions.shift(step)
    target = versions.first.to_i
    ROM::SQL::RakeSupport.run_migrations(target: step)

    puts "<= db:rollback version=[#{target}] executed"
  end

  task :rom_configuration do
    Rake::Task['db:setup'].invoke
  end

  desc 'Perform migration reset (full erase and migration up)'
  task reset: :rom_configuration do
    DbTaskHelper.call_db_command('dropdb', '--force')
    Rake::Task['db:create'].invoke
    ROM::SQL::RakeSupport.run_migrations
    puts '<= db:reset executed'
  end

  desc 'Create a migration (parameters: NAME, VERSION)'
  task :create_migration, %i(name version) => :rom_configuration do |_, args|
    name, version = args.values_at(:name, :version)

    if name.nil?
      puts "No NAME specified. Example usage:
        `rake db:create_migration[create_users]`"
      exit
    end

    path = ROM::SQL::RakeSupport.create_migration(*[name, version].compact)

    puts "<= migration file created #{path}"
  end

  desc 'Migrate the database (options [version_number])]'
  task :migrate, [:version] => :rom_configuration do |_, args|
    version = args[:version]
    options = { allow_missing_migration_files: true }
    if version.nil?
      ROM::SQL::RakeSupport.run_migrations(**options)
      puts '<= db:migrate executed'
    else
      ROM::SQL::RakeSupport.run_migrations(target: version.to_i, **options)
      puts "<= db:migrate version=[#{version}] executed"
    end
  end

  desc 'Perform migration down (erase all data)'
  task clean: :rom_configuration do
    ROM::SQL::RakeSupport.run_migrations(target: 0, allow_missing_migration_files: true)
    puts '<= db:clean executed'
  end
end
```

From now on, you’ll use `rake db:migrate` and related commands instead of `hanami db migrate`

```shell
bundle exec rake db:migrate
```

### Upgrade tests  to prepare them for switch to rom-factory

During ROM upgrade, we will need to switch from fabricator gem to use factory, with new syntax. This pr extracts syntax changes, so it will be easier to review the main pr.

We have created a helper to implement the interface from `rom-factory`, so we can change them without affecting all our test suits.

```ruby
module RSpec
  module Helpers
    module Factories
      def build(entity_type, **attributes)
        # this will be changes to Factory usage soon
        Fabricate.build(entity_type, **attributes)
      end

      def create(entity_type, **attributes)
        # this will be changes to Factory usage soon
        Fabricate.create(entity_type, **attributes)
      end

    end
  end
end
```

### Enable pg_array and pg_json extensions on sequel dbs

Upgrading to ROM 5 also meant to upgrade sequel gem.

Sequel shows deprecation warning, saying that PG_JSON extension will be enabled by default after the upgrade.

Also, we had multiple database clients hooked up, and for some of them we used sequel gem directly. We needed to enable the `pg_array` and `pg_json` extensions to make behaviour more unified for all dbs.

```ruby
# spec/spec_helper.rb

DB_CLIENT.extension(:pg_array, :pg_json)
```

This improved reading jsonb columns and automatic hash transformations.

#### Make sure you sort columns to use copy_table

copy_table requires columns to be provided in the fixed order. If you pass the hash, things may break in after upgrading sequel

### Refactor tests to not use Hanami::Model::Error

```ruby
# THEN
expect { worker.perform }.to raise_error(Hanami::Model::Error, 'something')

# NOW
let(:rom_error) { Hanami::Model::Error.new('something') }
# Now use hte rom_error wherever Hanami::Model::Error was called before
expect { worker.perform }.to raise_error(rom_error)
```

### Add application_entity

```ruby
# THEN
class Alert < Hanami::Entity
# frozen_string_literal: true

# NOW
class Alert < ApplicationEntity
end
```

```ruby
# lib/your_app/entities/_application_entity.rb

# This file needs to be loaded first, therefore it is named with `_` prefix.
# It's only a temporary solution which will be fixed by wrapping entities in the
# Entities namespace soon
#
class ApplicationEntity < Hanami::Entity
end
```

### Remove usage of root relation from the repository

```ruby
# THEN
your_repo
  .root
  .some_items

# NOW
your_repo
  .root
  .some_items
```

## Now upgrade to ROM 5.0

### Remove `hanami-model` and `hanami-fabrication`

```ruby
# Gemfile
- gem 'hanami-model', '~> 1.3'
- gem 'hanami-fabrication', ascenda_private: 'Kaligo/hanami-fabrication', tag: 'v0.2.0'
```

Install ROM & needed gems

```ruby
# Gemfile
gem 'dry-schema'
gem 'hanami', '~> 1.3'
gem 'hanami-validations', '2.0'
gem 'rom', '~> 5.0'
gem 'rom-sql', '~>3.5'
gem 'rom-factory'
```

### Setup relevant infrastructure

Example ROM configuration file. Another examples you can find in [HME028, where we configure ROM from scratch](/episodes/28-configure-rom-from-scratch).

```ruby

require 'sequel'

Sequel.extension :pg_array, :pg_json
Sequel.default_timezone = :utc

require 'rom'
require 'rom/sql'
ROM::SQL.load_extensions :postgres

module Persistence
  def self.db
    @db ||= ROM.container(configuration)
  end

  def self.relations
    db.relations
  end

  def self.configuration
    @configuration ||=
      ROM::Configuration.new(
        :sql,
        ENV.fetch('DATABASE_URL'),
        **options
      ).tap do |config|
        config.auto_registration(Hanami.root.join('lib/your_app/persistence'), namespace: 'Persistence')
        config.plugin(:sql, relations: :pagination)
      end
  end

  def self.options
    {
      logger: Hanami.logger,
      extensions: %i[pg_array pg_json]
    }
  end
end
```

With this you can switch your app to use new DB configuration.

```ruby
Hanami::Model.configuration.connection
        Persistence.configuration.default_gateway
```

### Update repositories syntax

```ruby
# THEN
class MyTableRepository < Hanami::Repository
.group(:some_id)
.pluck(%i(some_id other_column))
.select { int.count(:some_column).distinct }
my_relation.select { int.max(:timestamp) }

# NOW
class MyTableRepository < Repository[:my_tables]
.group(Sequel.lit("data->>'some_id'"))
end
.pluck(:some_id, :other_column)
.select { [integer.count(:some_column).distinct.as(:count)] }
my_relation.select { [integer.max(timestamp).as(:timestamp)] }

```

```ruby
# Remove. map_to is not needed in ROM 5
.map_to(EntityName)
```

### Update dry-validation syntax

[dry-validation](/episodes/20-dry-validation) update was one of our bigger hiccups. Unfortunately, since 0.3 version, dry-schema was extracted to separate gem, and with the advanced rules, syntax had been changed a bit. If you have a large number of contracts in the system, updating all of them will be tricky.

:::tip
We've developed some ways to simplify this, that will be described in the last section
:::

### Update the `ApplicationEntity`

```ruby
class ApplicationEntity < ROM::Struct
  # Implement generic equality for entities
  #
  # Two entities are equal if they are instances of the same class and they
  # have the same id.
  #
  # Copied from hanami-model.
  # TODO: Consider removing this after fixing issue with ROM
  # overwriting schema definition of Entity
  def ==(other)
    self.class.name == other.class.name &&
      id == other.id
  end
end
```

### Replace Hanami::Model errors

```ruby
# THEN
rescue Hanami::Model::UniqueConstraintViolationError
rescue Hanami::Model::Error => e

# NOW
rescue ROM::SQL::UniqueConstraintError
rescue ROM::SQL::Error => e
```

### Add relations to ALL tables

```ruby
# example relation
module Persistence
  module Relations
    class MyTable < ROM::Relation[:sql]
      schema(:my_tables, infer: true) do
        attribute :metadata, ::Types::JSONB
      end

      auto_struct true
    end
  end
end
```

### Add custom types if needed

TODO: Write an explanation for this

```ruby
module Types
  include Dry.Types()

  JSONB = Types::Strict::Nil | ::Coercions.HashToJSONB.meta(
    read: ::Coercions.SymbolizedHash
  )

  UUID = ROM::SQL::Postgres::Types::UUID
end
```

### Replace Fabricators with Factories.

All fabricators should be replaced by factory definitions. Example:

```ruby
# THEN
Fabricator(:article) do
  id { SecureRandom.uuid }
  created_at { Faker::Time.backward(days: 14, period: :evening) }
  updated_at { Faker::Time.backward(days: 14,
end

# NOW
Shared::Factory.define(:article, struct_namespace: Object) do |f|
  f.id { SecureRandom.uuid }
  f.created_at { Faker::Time.backward(days: 14, period: :evening) }
  f.updated_at { Faker::Time.backward(days: 14, period: :evening) }
end
```

## Upgrade Ruby to 3.X

TODO: Notes

# 3. Large-size applications

This approach is designed for very large monoliths, where no downtime is allowed, no production bugs accepted, and dozens of PRs are created every day, making code conflicts a huge problem, and the break on development is not allowed.

This is gradual upgrade scenario, that will take long time, but will allow your team to not create huge conflicts during the upgrade process.

> This is in progress

### Summary

I hope you've enjoyed this article, and if you want to see more content in this fashion,** Subscribe to [this YT channel](https://www.youtube.com/c/hanamimastery)**, **[Newsletter](https://mailchi.mp/6ac8f64f3c5d/hanami-mastery-newsletter)**, and **follow me [on Twitter](https://twitter.com/hanamimastery)**!  As always, all links you can find the description of the video or in the https://hanamimastery.com.

Also, If you have any suggestions of amazing ruby gems You'd like me to cover, or ideas on how to improve, please mention it in the comments!

### Special Thanks!

I'd like to thank [LATEST SPONSORS]. for supporting this project!

Any support allows me to spend more time on creating this content, promoting great open source projects.

Also, check out two of my previous videos here! Thank you all for being here, you're awesome! - and see you in the next Hanami Mastery episode!

- [John Smith]()- for a great cover image
