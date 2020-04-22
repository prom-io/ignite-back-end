import {Injectable, OnModuleInit} from "@nestjs/common";
import {Client, ClientKafka, Transport} from "@nestjs/microservices";
import {SaveCommentRequest, SaveStatusLikeRequest, SaveStatusRequest, SaveUnlikeRequest, SaveUserSubscriptionRequest} from "./types/request";

@Injectable()
export class BtfsKafkaClient implements OnModuleInit {
    @Client(({
        transport: Transport.KAFKA,
        options: {
            client: {
                clientId: "ignite_backend_client",
                brokers: ["localhost:29092"]
            },
            consumer: {
                groupId: "ignite"
            }
        }
    }))
    private readonly clientKafka: ClientKafka;

    public onModuleInit(): void {
        this.clientKafka.subscribeToResponseOf("ignite.subscribes.add");
        this.clientKafka.subscribeToResponseOf("ignite.unsubscribes.add");
        this.clientKafka.subscribeToResponseOf("ignite.likes.add");
        this.clientKafka.subscribeToResponseOf("ignite.unlikes.add");
        this.clientKafka.subscribeToResponseOf("ignite.posts.add");
        this.clientKafka.subscribeToResponseOf("ignite.comments.add");
    }

    public saveUserSubscription(saveUsersSubscriptionRequest: SaveUserSubscriptionRequest): Promise<void> {
        return this.clientKafka.send("ignite.subscribes.add", saveUsersSubscriptionRequest).toPromise();
    }

    public saveUserUnsubscription(saveUserUnsubscriptionRequest: SaveUserSubscriptionRequest): Promise<void> {
        return this.clientKafka.send("ignite.unsubscribes.add", saveUserUnsubscriptionRequest).toPromise();
    }

    public saveStatusLike(saveStatusLikeRequest: SaveStatusLikeRequest): Promise<void> {
        return this.clientKafka.send("ignite.likes.add", saveStatusLikeRequest).toPromise();
    }

    public saveStatusUnlike(saveUnlikeRequest: SaveUnlikeRequest): Promise<void> {
        return this.clientKafka.send("ignite.unlikes.add", saveUnlikeRequest).toPromise();
    }

    public saveStatus(saveStatusRequest: SaveStatusRequest): Promise<void> {
        return this.clientKafka.send("ignite.posts.add", saveStatusRequest).toPromise();
    }

    public saveComment(saveCommentRequest: SaveCommentRequest): Promise<void> {
        return this.clientKafka.send("ignite.comments.add", saveCommentRequest).toPromise();
    }
}
