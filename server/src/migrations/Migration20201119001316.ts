import { Migration } from '@mikro-orm/migrations';

export class Migration20201119001316 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" date null default null, "delete_at" date null default null, "disabled" bool not null default false, "username" text not null, "password" text not null);');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');

    this.addSql('create table "post" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" date null default null, "delete_at" date null default null, "disabled" bool not null default false, "title" text not null);');
  }

}
