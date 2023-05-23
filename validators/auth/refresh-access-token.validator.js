import yup from 'yup';

export default yup.object({
    body: yup.object({
        accessToken: yup.string().required('Access token is required'),
        refreshToken: yup.string().required('Refresh token is required'),
    }),
});