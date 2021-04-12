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
  const { get, loading, error } = useFetch(
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
    get(`?EMAIL=${escape(data.email)}&id=${listId}&u=${userId}`);
  };

  return (
    <>
      <Typography variant="h4">Do you like this content?</Typography>
      <Typography paragraph>
        Subscribe to our Newsletter for weekly updates about new articles and
        <strong> free programming tips!</strong>
      </Typography>
      <Grid
        container
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        spacing={2}
      >
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Grid item>
              <TextField
                disabled={loading}
                variant="outlined"
                size="small"
                error={error || errors.email}
                helperText={
                  (errors.email && errors.email.message) ||
                  (error && error.message)
                }
                label="Email"
                {...field}
              />
            </Grid>
          )}
        />
        <Grid item>
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
