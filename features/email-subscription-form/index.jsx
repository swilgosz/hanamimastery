import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, TextField, Grid, Typography } from '@material-ui/core';
import useFetch from 'use-http';

// TBD waiting for mailchimp priviledges

const schema = yup.object().shape({
  email: yup.string().email().required(),
});

const userId = '0cbf9512faab835f9be304437';
const listId = '4c303aa769';

export default function EmailSubscriptionForm() {
  const { post, loading, error } = useFetch(
    'https://driggl.us9.list-manage.com/subscribe/'
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data) => {
    post({ email_address: data.email });
  };

  return (
    <>
      <div id="om-jygtzgejjk4smsfhwyo7-holder"></div>
    </>
  );
}
