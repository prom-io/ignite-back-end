import {User} from "../users/entities";
import {config} from "../config";

export const isAdmin = (user?: User): boolean => {
    if (!user) {
        return false;
    }

    if (!config.additionalConfig.adminUsers || config.additionalConfig.adminUsers.length === 0) {
        return false;
    }

    return config.additionalConfig.adminUsers.includes(user.ethereumAddress);
};
