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

- If the `class` is decorated with this decorator, then it triggers `handle` method of the decorated class when matching event is consumed.
  Only `Muavin` classes should be decorated with this decorator.

```typescript
@KafkaSubscriber({
  topicName: 'users',
  filter: (payload) => payload.event_name === 'deleted',
})
class MyMuavin extends Muavin {
  // Base Muavin has handle method
}
```

- If a method in the class is decorated with this decorator, then it triggers the decorated method in the class.

```typescript
class MyScheduler {
  constructor(@InjectQueue('scheduler') private schedulerProcessor: Queue) {}

  ---

  @KafkaSubscriber({
    topicName: 'users',
    filter: (payload) => payload.event_name === 'deleted',
  })
  async schedule(event: Record<string, any>): Promise<void> {
    await this.schedulerProcessor.add('process', event.payload, {});
  }
}
```

### Muavin

Marks the decorated class as `Muavin`.
The decorated class is responsible for providing a `Transformer`, `Enricher`, and `Destination`(s).
Decorated class should be extended from `Muavin`. (`import { Muavin } from '@core'`)

```typescript
import { Injectable } from '@nestjs/common';

import { KafkaSubscriber } from '@adapters/kafka';
import { Muavin } from '@core';

import { UserTransformer } from '../transformers/user.transformer';
import { UserEnricher } from '../enrichers/user.enricher';

import { AmplitudeDestination } from '../destinations/amplitude.destination';
import { BrazeDestination } from '../destinations/braze.destination';

@Injectable()
@KafkaSubscriber({
  topicName: 'users',
  filter: (payload) => payload.event_name === 'created',
})
export class UserDeletedMuavin extends Muavin {
  constructor(
    private userTransformer: UserTransformer,
    private userEnricher: UserEnricher,
    private amplitudeDestination: AmplitudeDestination,
    private brazeDestination: BrazeDestination,
  ) {
    super();

    this.transformer = this.userTransformer;
    this.enricher = this.userEnricher;
    this.actions = [
      { transformer: userTransformer, destination: this.amplitudeDestination },
      { destination: this.brazeDestination }
    ];
  }
}
```

### Transformer

Transformers accept the passed event payload from Muavin, transforms it then returns result to the next class, it could be an `Enricher` if defined, or `Destination`(s).

Transformer classes should `implement` BaseTransformer generic.
This generic's first parameter is input type, and the second parameter is output type.

`export class UserTransformer implements BaseTransformer<IncomingPayload, TransformedPayload> { ... }`

Transformer classes should have `perform` method which handles the transformation.

```typescript
import { Injectable } from '@nestjs/common';

import { BaseTransformer } from '@core';

import { UsersTopicPayload, UsersTransformedPayload } from '../interfaces';

@Injectable()
export class UserTransformer implements BaseTransformer<UsersTopicPayload, UsersTransformedPayload> {
  perform(payload: UsersTopicPayload): UsersTransformedPayload {
    // payload => { user_id: 1 }
    return {
      data: payload,
    };
    // result => { data: { user_id: 1 } }
  }
}
```

### Enricher

Enrichers accepts the transformed payload from `Transformer` class if defined or gets passed payload from the event and Enriches it through some API requests.
Perhaps you have `user_id` in the event payload but don't have user's `email`.
With enrichers, you can get other required fields for the user from your API.

Enricher classes should `implement` BaseEnricher generic.
BaseEnricher's first parameter is input and the second one is output type.

`export class UserEnricher implements BaseEnricher<UsersTransformedPayload, Promise<UsersEnrichedPayload>> { ... }`

Enricher classses should have `perform` method which handles the enrichment.

```typescript
import { HttpService, Injectable } from '@nestjs/common';

import { BaseEnricher } from '@core';

import { UsersTransformedPayload, UsersEnrichedPayload } from '../interfaces';

@Injectable()
export class UserEnricher implements BaseEnricher<UsersTransformedPayload, Promise<UsersEnrichedPayload>> {
  constructor(private readonly httpClient: HttpService) {}

  async perform(payload: UsersTransformedPayload): Promise<UsersEnrichedPayload> {
    // payload => { data: { user_id: 1 } }
    const { data: userResponse } = await this.httpClient.get('https://api.example.com/users/1').toPromise();

    return {
      data: {
        ...payload.data,
        ...userResponse,
      },
    };
    // result => { user_id: 1, email: 'test@example.com' }
  }
}
```

## Destination Decorator

Destinations accepts the enriched payload if defined any or transformed payload and sends it to the 3rd party providers through some API requests.

Marked class should `implement` BaseDestination generic.
BaseDestination's first parameter is incoming payload type.

`export class AmplitudeDestination implements BaseDestination<UsersEnrichedPayload>`

Destination classses should have `perform` method which handles API request(s).

```typescript
import { HttpService, Injectable } from '@nestjs/common';

import { BaseDestination } from '@core';
import { UsersEnrichedPayload } from '../interfaces';

@Injectable()
export class AmplitudeDestination implements BaseDestination<UsersEnrichedPayload> {
  constructor(private readonly httpClient: HttpService) {}

  async perform(payload: UsersEnrichedPayload): Promise<void> {
    // payload => { data: { user_id: 1, email: 'test@example.com' } }
    await this.httpClient.post('https://api.amplitude.com/events', { payload });
  }
}
```

### Entire lifecycle of event from Muavin to Destinations

```bash
Starting
--------------------------------------------
[VerificationRequestMuavin] handling event for payload {
  user_id: 1,
  order_number: '1',
  verification_state: 'pending',
  requester_id: 2
}

[VerificationRequestTransformer] transformed payload {
  data: {
    user_id: 1,
    order_number: '1',
    verification_state: 'pending',
    requester_id: 2
  }
}

[UserEnricher] enriched payload {
  data: {
    user_id: 1,
    order_number: '1',
    verification_state: 'pending',
    requester_id: 2
  },
  enrichment: {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'Sincere@april.biz',
    address: {
      street: 'Kulas Light',
      suite: 'Apt. 556',
      city: 'Gwenborough',
      zipcode: '92998-3874',
      geo: [Object]
    },
    phone: '1-770-736-8031 x56442',
    website: 'hildegard.org',
    company: {
      name: 'Romaguera-Crona',
      catchPhrase: 'Multi-layered client-server neural-net',
      bs: 'harness real-time e-markets'
    }
  }
}

[AmplitudeDestination] perform triggered with payload {
  data: {
    user_id: 1,
    order_number: '1',
    verification_state: 'pending',
    requester_id: 2
  },
  enrichment: {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'Sincere@april.biz',
    address: {
      street: 'Kulas Light',
      suite: 'Apt. 556',
      city: 'Gwenborough',
      zipcode: '92998-3874',
      geo: [Object]
    },
    phone: '1-770-736-8031 x56442',
    website: 'hildegard.org',
    company: {
      name: 'Romaguera-Crona',
      catchPhrase: 'Multi-layered client-server neural-net',
      bs: 'harness real-time e-markets'
    }
  }
}
[BrazeDestination] perform triggered with payload {
  data: {
    user_id: 1,
    order_number: '1',
    verification_state: 'pending',
    requester_id: 2
  },
  enrichment: {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'Sincere@april.biz',
    address: {
      street: 'Kulas Light',
      suite: 'Apt. 556',
      city: 'Gwenborough',
      zipcode: '92998-3874',
      geo: [Object]
    },
    phone: '1-770-736-8031 x56442',
    website: 'hildegard.org',
    company: {
      name: 'Romaguera-Crona',
      catchPhrase: 'Multi-layered client-server neural-net',
      bs: 'harness real-time e-markets'
    }
  }
}
[AmplitudeDestination] Success!
[BrazeDestination] Success!
[VerificationRequestMuavin] Success!

Done
```
