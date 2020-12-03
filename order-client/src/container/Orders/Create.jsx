import React from 'react';
import useFetch from 'use-http';
import Container from '@material-ui/core/Container';
import { useFormik} from 'formik';
import { useHistory } from "react-router-dom";
import * as Yup from 'yup';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Backdrop from '@material-ui/core/Backdrop';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSnackbar } from 'notistack';


const newOrderSchema = Yup.object({
  name: Yup
    .string('Enter your fullname')
    .required('Name is required'),
});

const NewOrder = () => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const { post, response, loading, error } = useFetch('http://localhost:4200/api');

  const formik = useFormik({
    initialValues: {
      name: '',
      amountCents: ''
    },
    validationSchema: newOrderSchema,
    onSubmit: async (values) => {
      await post('/orders', { ...values })

      if (response.ok) {
        enqueueSnackbar('New order successfully created', { variant: 'success' })
        history.push('/orders');
      }
    },
  });
  
  if (error) {
    return <MuiAlert elevation={6} variant="filled" severity="error">Sorry, Could not process new order!</MuiAlert>;
  }

  if (loading) {
    return (
      <Backdrop open={loading} >
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  }

  return (
    <Container maxWidth="xs">
      <Box position="absolute" top={8} right={8}>
        <IconButton onClick={() => history.push('/orders')} color="default" component="span">
          <CloseIcon fontSize="large" />
        </IconButton>
      </Box>
      <Box mt={12} textAlign="center">
        <h1>Create New Order</h1>
      </Box>
      <Box my={6}>
        <form onSubmit={formik.handleSubmit}>
          <Box my={4}>
            <TextField
              fullWidth
              variant="outlined"
              id="name"
              name="name"
              label="Fullname"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Box>
          <Box my={4}>
            <TextField
              fullWidth
              variant="outlined"
              id="amountCents"
              name="amountCents"
              label="Amount"
              type="number"
              value={formik.values.amountCents}
              onChange={formik.handleChange}
              error={formik.touched.amountCents && Boolean(formik.errors.amountCents)}
              helperText={formik.touched.amountCents && formik.errors.amountCents}
            />
          </Box>
          <Button size="large" color="primary" variant="contained" fullWidth type="submit">
            Submit
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default NewOrder;