import {AfterLoad, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn} from "typeorm";
import {UserDynamicFields} from "./UserDynamicFields";
import {UserPreferences} from "./UserPreferences";
import {MediaAttachment} from "../../media-attachments/entities";

interface IUserPlainObject {
    id: string;
    ethereumAddress: string;
    username: string;
    displayedName: string;
    privateKey?: string;
    createdAt: Date;
    avatar?: MediaAttachment;
    btfsHash?: string;
    peerIp?: string;
    peerWallet?: string;
    btfsCid?: string;
    bio?: string;
    preferences?: UserPreferences;
    dynamicFields: UserDynamicFields[],
    remote: boolean
}

@Entity()
export class User {
    @PrimaryColumn()
    id: string;

    @Column()
    ethereumAddress: string;

    @Column({nullable: true})
    privateKey?: string;

    @Column({nullable: true})
    displayedName: string;

    @Column({nullable: true})
    username: string;

    @Column()
    createdAt: Date;

    @Column()
    remote: boolean;

    @Column({nullable: true})
    avatarUri?: string;

    @ManyToOne(() => MediaAttachment, {nullable: true, eager: true})
    avatar?: MediaAttachment;

    @Column({nullable: true})
    btfsHash?: string = undefined;

    @Column({nullable: true})
    peerIp?: string;

    @Column({nullable: true})
    peerWallet?: string;

    @Column({nullable: true})
    btfsCid?: string;

    @Column({nullable: true})
    bio?: string;

    @OneToOne(() => UserPreferences, preferences => preferences.user, {nullable: true, eager: true})
    @JoinColumn()
    preferences?: UserPreferences;

    @OneToMany(
        () => UserDynamicFields,
            dynamicFields => dynamicFields.user,
        {eager: true, cascade: true}
        )
    dynamicFields: UserDynamicFields[];

    latestDynamicFields?: UserDynamicFields;

    constructor(plainObject: IUserPlainObject) {
        Object.assign(this, plainObject);
    }

    @AfterLoad()
    public setLatestDynamicFields() {
        this.latestDynamicFields = this.dynamicFields[0];
    }

    public getLatestDynamicFields(): UserDynamicFields {
        if (!this.latestDynamicFields) {
            this.setLatestDynamicFields();
        }

        return this.latestDynamicFields!;
    }
}
