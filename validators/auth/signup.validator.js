import yup from 'yup';

export default yup.object({
    body: yup.object({
        name: yup.string().required('Name is required'),
        surname: yup.string().required('Surname is required'),
        email: yup.string().email('Invalid email').required('Email is required'),
        password: yup.string()
            .min(8, 'Length of password must be at least 8 characters')
            .max(16, 'Length of password must be at most 16 characters')
            .required('Password is required'),
        confirmPassword: yup.string()
            .oneOf([yup.ref('password')], 'Passwords must match')
            .required('Password confirmation is required'),
    }),
});