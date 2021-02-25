export class BaseHandler {
  async handle(payload: any) {
    console.log(`Handler invoked for `, this.constructor.name);
    console.log(payload);
  }
}
