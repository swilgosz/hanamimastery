export default function CourseAd({ bg, size }) {
  return (
    <div className="columns" style={{ backgroundColor: bg }}>
      <div className="column is-one-half">
        <img src="/rails-rest-api.jpg" alt="Rails api thumbnail" />
      </div>
      <div className="column is-one-half">
        <div className="content">
          <h2 className="title">Ruby On Rails REST API</h2>
          <h3 className={`subtitle ${size === 'small' ? 'is-4' : 'is-5'}`}>
            The complete guide
          </h3>
          <p className={size === 'small' ? 'is-size-6' : 'is-size-3'}>
            Create professional API applications that you can hook anything
            into! Learn how to code like professionals using Test Driven
            Development!
          </p>
        </div>
        <a
          href="https://www.udemy.com/ruby-on-rails-api-the-complete-guide/?couponCode=DGLWEB"
          target="_blank"
          className={size === 'small' ? 'is-medium' : 'is-large'}
          rel="noreferrer"
        >
          Take this course!
        </a>
      </div>
    </div>
  );
}
