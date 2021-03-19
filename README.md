### Nest Transformer

Transformer implementation for any message broker. Only Kafka is supported for now.

### Running

```bash
  # Optional. If you have a any other running kafka and zookeper images, you should stop them.
  $ docker stop $(docker ps -aq)

  # Start docker in daemon mode (background).
  $ docker-compose up -d

  # Install dependencies
  $ npm i

  # Start the application
  $ npm run start:dev

  # Publish events for testing

  # Install kafkacat to publish events to local kafka
  brew install kafkacat

  $ npm run publish:users
  OR
  $ npm run publish:id_check
```

### KafkaSubscriber Decorator

This decorator subscribes to the given topic with ability to filter events.
Then triggers `handle` method of the decorated class when matching event is consumed.
Only `Handler` classes should be decorated with this decorator.

```typescript
@KafkaSubscriber({
  topicName: 'users',
  filter: (payload) => payload.event_name === 'deleted',
})
```

### Handler Decorator

Marks the decorated class as `Handler`. Decorated Handler class doesn't need to have any methods.
Decorated class should be extended from `BaseHandler`. (`import { BaseHandler } from '@core'`)
Then the BaseHandler takes care of assigning other classes like `Transformer`, `Enricher` and `Action`s to decorated class.

```typescript
import { Injectable } from '@nestjs/common';

import { KafkaSubscriber } from '@adapters/kafka';
import { Handler, BaseHandler } from '@core';

@Injectable()
@KafkaSubscriber({
  topicName: 'users',
  filter: (payload) => payload.event_name === 'deleted',
})
@Handler({ name: 'UserDeletedHandler' })
export class UserDeletedHandler extends BaseHandler {}
```

### Transformer Decorator

Marks the decorated class as `Transformer` and assignes to the given `Handler`(s).

Transformers accepts the passed event payload from Handler and transforms it then returns result to the next class.

Marked class should `implement` BaseTransformer generic.
BaseTransformer's first parameter is input and the second one is output type.

`export class UserTransformer implements BaseTransformer<IncomingPayload, TransformedPayload> { ... }`

The decorated class should have `perform` which handles the transformation.

```typescript
import { Injectable } from '@nestjs/common';

import { Transformer, BaseTransformer } from '@core';
import { UsersTopicPayload, UsersTransformedPayload } from '../interfaces';

@Injectable()
@Transformer({ handlers: ['UserDeletedHandler', 'UserCreatedHandler'] })
export class UserTransformer implements BaseTransformer<UsersTopicPayload, UsersTransformedPayload> {
  perform(payload: UsersTopicPayload): UsersTransformedPayload {
    return {
      // Place payload under "data" key.
      data: payload,
    };
  }
}
```

### Enricher Decorator

Marks the decorated class as `Enricher` and assignes to the given `Handler`(s).

Enrichers accepts the transformed payload and Enriches it through some API requests.
Perhaps you have `user_id` in the event payload but not `email`.
With enrichers, you can get other required fields for the user from your API.

Marked class should `implement` BaseEnricher generic.
BaseEnricher's first parameter is input and the second one is output type.

`export class UserEnricher implements BaseEnricher<UsersTransformedPayload, Promise<UsersEnrichedPayload>> { ... }`

The decorated class should have `perform` method which handles the enrichment.

```typescript
import { HttpService, Injectable } from '@nestjs/common';

import { Enricher, BaseEnricher } from '@core';
import { UsersTransformedPayload, UsersEnrichedPayload } from '../interfaces';

@Injectable()
@Enricher({
  handlers: ['UserDeletedHandler', 'UserCreatedHandler'],
})
export class UserEnricher implements BaseEnricher<UsersTransformedPayload, Promise<UsersEnrichedPayload>> {
  constructor(private readonly httpClient: HttpService) {}

  async perform(payload: UsersTransformedPayload): Promise<UsersEnrichedPayload> {
    const { data: userResponse } = await this.httpClient.get('https://api.example.com/users/1').toPromise();

    return {
      data: {
        ...payload.data,
        ...userResponse,
      },
    };
  }
}
```

## Action Decorator

Marks the decorated class as `Action` and assignes to the given `Handler`(s).

Actions accepts the enriched payload and sends it to the 3rd party providers through some API requests.

Marked class should `implement` BaseAction generic.
BaseAction's first parameter is incoming payload type.

`export class AmplitudeAction implements BaseAction<UsersEnrichedPayload>`

The decorated class should have `perform` method which handles the action.

```typescript
import { HttpService, Injectable } from '@nestjs/common';

import { Action, BaseAction } from '@core';
import { UsersEnrichedPayload } from '../interfaces';

@Injectable()
@Action({
  handlers: ['UserDeletedHandler', 'UserCreatedHandler'],
})
export class AmplitudeAction implements BaseAction<UsersEnrichedPayload> {
  constructor(private readonly httpClient: HttpService) {}

  async perform(payload: UsersEnrichedPayload): Promise<void> {
    await this.httpClient.post('https://api.amplitude.com/events');
  }
}
```

### Entire lifecycle of event from Handler to Actions

```bash
--------------------------------------------
[Kafka Service] Received payload {
  event_name: 'id_check_request',
  payload: {
    user_id: 1,
    order_number: '1',
    verification_state: 'pending',
    requester_id: 2
  }
}
--------------------------------------------
--------------------------------------------
[VerificationRequestHandler] handling event for payload {
  user_id: 1,
  order_number: '1',
  verification_state: 'pending',
  requester_id: 2
}

[VerificationRequestHandler] transformed payload {
  data: {
    user_id: 1,
    order_number: '1',
    verification_state: 'pending',
    requester_id: 2
  }
}

[VerificationRequestHandler] enriched payload {
  data: {
    user_id: 1,
    order_number: '1',
    verification_state: 'pending',
    requester_id: 2,
    userId: 1,
    id: 1,
    title: 'delectus aut autem',
    completed: false
  }
}

[VerificationRequestHandler] calling action AmplitudeAction

[AmplitudeAction] perform triggered with payload {
  data: {
    user_id: 1,
    order_number: '1',
    verification_state: 'pending',
    requester_id: 2,
    userId: 1,
    id: 1,
    title: 'delectus aut autem',
    completed: false
  }
}
[VerificationRequestHandler] calling action BrazeAction

[BrazeAction] perform triggered with payload {
  data: {
    user_id: 1,
    order_number: '1',
    verification_state: 'pending',
    requester_id: 2,
    userId: 1,
    id: 1,
    title: 'delectus aut autem',
    completed: false
  }
}
[VerificationRequestHandler] handling completed.
--------------------------------------------
```
