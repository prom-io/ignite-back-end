import {observable, action} from "mobx";

export class DrawerStore {
    @observable
    open: boolean = false;

    @action
    setOpen = (open: boolean): void => {
        this.open = open;
    }
}
