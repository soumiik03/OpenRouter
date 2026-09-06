import { z } from "zod";

export const ModelIdParamsModel = z.object({ 
    id: z.coerce.number().int().positive() 
});
