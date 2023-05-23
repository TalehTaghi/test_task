import yup from 'yup';

export default yup.object({
    body: yup.object({
        email: yup.string().email('Invalid email').required('Email is required'),
        password: yup.string().required('Password is required'),
    }),
});