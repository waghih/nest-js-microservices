import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import useFetch from 'use-http';
import Backdrop from '@material-ui/core/Backdrop';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

const ShowOrder = () => {
  const history = useHistory();
  const { id: orderId } = useParams();
  const { get, loading, error, data } = useFetch('http://localhost:4200/api');

  useEffect(() => {
    const loadOrder = async () => {
      await get(`/orders/${orderId}`);
    };

    loadOrder();
  }, [get, orderId]);

  if (error) {
    return <MuiAlert elevation={6} variant="filled" severity="error">Sorry, Could not fetch order!</MuiAlert>;
  }

  if (loading) {
    return (
      <Backdrop open={loading} >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  const renderStatus = (status) => {
    if (status === 'delivered') {
      return (
        <Typography component="span">
          <Box color="info.main">{status?.toUpperCase()}</Box>
        </Typography>
      );
    } else if (status === 'confirmed') {
      return (
        <Typography component="span">
          <Box color="success.main">{status?.toUpperCase()}</Box>
        </Typography>
      );
    } else if (status === 'cancelled') {
      return (
        <Typography component="span">
          <Box color="secondary.main">{status?.toUpperCase()}</Box>
        </Typography>
      );
    }

    return (
      <Typography component="span">
        <Box color="text.primary">{status?.toUpperCase()}</Box>
      </Typography>
    );
  }

  return (
    <Container maxWidth="xs">
      <Box position="absolute" top={8} right={8}>
        <IconButton onClick={() => history.push('/orders')} color="default" component="span">
          <CloseIcon fontSize="large" />
        </IconButton>
      </Box>
      <Box mt={12} textAlign="center">
        <h1>Order #{orderId}</h1>
      </Box>
      <Box my={6}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography align="right">Name</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{data?.name}</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography align="right">Amount:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{data?.amountCents}</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography align="right">Status:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{renderStatus(data?.status)}</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography align="right">TransactionID:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{data?.transactionId}</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography align="right">Created At:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{data?.createdAt}</Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ShowOrder;
