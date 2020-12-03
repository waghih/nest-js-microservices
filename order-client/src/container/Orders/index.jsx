import React, { useState, useEffect } from 'react';
import useFetch from 'use-http';
import { useHistory } from 'react-router-dom';
import Backdrop from '@material-ui/core/Backdrop';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const Orders = () => {
  const history = useHistory();
  const [orders, setOrders] = useState([]);
  const { get, response, loading, error } = useFetch('http://localhost:4200/api');

  useEffect(() => {
    const loadOrders = async () => {
      const initialOrders = await get('/orders')
      if (response.ok) setOrders(initialOrders);
    }

    loadOrders();
  }, [get, response])

  if (error) {
    return <MuiAlert elevation={6} variant="filled" severity="error">Sorry, Could not fetch orders!</MuiAlert>;
  }

  if (loading) {
    return (
      <Backdrop open={loading} >
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  }

  const renderStatus = (status) => {
    if (status === 'delivered') {
      return (
        <Typography component="span">
          <Box color="info.main">{status?.toUpperCase()}</Box>
        </Typography>
      )
    } else if (status === 'confirmed') {
      return (
        <Typography component="span">
          <Box color="success.main">{status?.toUpperCase()}</Box>
        </Typography>
      )
    } else if (status === 'cancelled') {
      return (
        <Typography component="span">
          <Box color="secondary.main">{status?.toUpperCase()}</Box>
        </Typography>
      )
    }

    return (
      <Typography component="span">
        <Box color="text.primary">{status?.toUpperCase()}</Box>
      </Typography>
    )
  }

  return (
    <Container>
      <Box my={6} >
        <Grid
          container
          direction="row"
          alignItems="center"
          justify="space-between"
        >
          <Grid item><h3>Orders Dashboard</h3></Grid>
          <Grid item>
            <Button onClick={() => history.push('/orders/new')} variant="contained" color="primary">
              New Order
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box mb={6}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell align="right"><strong>Name</strong></TableCell>
                <TableCell align="right"><strong>Amount</strong></TableCell>
                <TableCell align="right"><strong>Status</strong></TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell component="th" scope="row">
                    {order.id}
                  </TableCell>
                  <TableCell align="right">{order.name}</TableCell>
                  <TableCell align="right">{order.amountCents}</TableCell>
                  <TableCell align="right">{renderStatus(order.status)}</TableCell>
                  <TableCell align="right">
                    <Box flex="row">
                      <Button color="primary" onClick={() => history.push(`/orders/${order.id}`)}>View</Button>
                      {order.status === 'created' && <Button color="secondary">Cancel</Button>}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default Orders;