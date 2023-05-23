import yup from 'yup';

export default yup.object({
    query: yup.object({
        list_size: yup.number().optional(),
        page: yup.number().optional(),
    }),
});