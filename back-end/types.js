const zod=require("zod");
const signupSchema=zod.object({
    name:zod.string(),
    lastName:zod.string(),
    userName:zod.string().email(),
    password:zod.string(),
});
const signinSchema=zod.object({
    userName:zod.string().email(),
    password:zod.string()
})

const updateSchema=zod.object({
    name:zod.string().optional(),
    lastName:zod.string().optional(),
    userName:zod.string().email().optional()
})
module.exports={
                signupSchema,
                signinSchema,
                updateSchema
            }