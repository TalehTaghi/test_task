import yup from "yup";

export default yup.object({
    params: yup.object({
       id: yup.number().required(),
    }),
});