import {SetMetadata} from "@nestjs/common";
import {AdminUsers} from "./AdminUsers";

export const RequiresAdmin = () => SetMetadata("requiresAdmin", true);
