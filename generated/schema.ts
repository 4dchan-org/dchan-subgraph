// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Board extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Board entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Board entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Board", id.toString(), this);
  }

  static load(id: string): Board | null {
    return store.get("Board", id) as Board | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get title(): string {
    let value = this.get("title");
    return value.toString();
  }

  set title(value: string) {
    this.set("title", Value.fromString(value));
  }

  get postCount(): BigInt {
    let value = this.get("postCount");
    return value.toBigInt();
  }

  set postCount(value: BigInt) {
    this.set("postCount", Value.fromBigInt(value));
  }

  get threadCount(): BigInt {
    let value = this.get("threadCount");
    return value.toBigInt();
  }

  set threadCount(value: BigInt) {
    this.set("threadCount", Value.fromBigInt(value));
  }

  get name(): string {
    let value = this.get("name");
    return value.toString();
  }

  set name(value: string) {
    this.set("name", Value.fromString(value));
  }

  get score(): BigInt {
    let value = this.get("score");
    return value.toBigInt();
  }

  set score(value: BigInt) {
    this.set("score", Value.fromBigInt(value));
  }

  get isNsfw(): boolean {
    let value = this.get("isNsfw");
    return value.toBoolean();
  }

  set isNsfw(value: boolean) {
    this.set("isNsfw", Value.fromBoolean(value));
  }

  get isLocked(): boolean {
    let value = this.get("isLocked");
    return value.toBoolean();
  }

  set isLocked(value: boolean) {
    this.set("isLocked", Value.fromBoolean(value));
  }

  get createdBy(): string {
    let value = this.get("createdBy");
    return value.toString();
  }

  set createdBy(value: string) {
    this.set("createdBy", Value.fromString(value));
  }

  get createdAtBlock(): string {
    let value = this.get("createdAtBlock");
    return value.toString();
  }

  set createdAtBlock(value: string) {
    this.set("createdAtBlock", Value.fromString(value));
  }

  get createdAt(): BigInt {
    let value = this.get("createdAt");
    return value.toBigInt();
  }

  set createdAt(value: BigInt) {
    this.set("createdAt", Value.fromBigInt(value));
  }

  get lastBumpedAtBlock(): string {
    let value = this.get("lastBumpedAtBlock");
    return value.toString();
  }

  set lastBumpedAtBlock(value: string) {
    this.set("lastBumpedAtBlock", Value.fromString(value));
  }

  get lastBumpedAt(): BigInt {
    let value = this.get("lastBumpedAt");
    return value.toBigInt();
  }

  set lastBumpedAt(value: BigInt) {
    this.set("lastBumpedAt", Value.fromBigInt(value));
  }

  get jannies(): Array<string> {
    let value = this.get("jannies");
    return value.toStringArray();
  }

  set jannies(value: Array<string>) {
    this.set("jannies", Value.fromStringArray(value));
  }

  get threads(): Array<string | null> {
    let value = this.get("threads");
    return value.toStringArray();
  }

  set threads(value: Array<string | null>) {
    this.set("threads", Value.fromStringArray(value));
  }
}

export class BoardCreationEvent extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save BoardCreationEvent entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save BoardCreationEvent entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("BoardCreationEvent", id.toString(), this);
  }

  static load(id: string): BoardCreationEvent | null {
    return store.get("BoardCreationEvent", id) as BoardCreationEvent | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get board(): string | null {
    let value = this.get("board");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set board(value: string | null) {
    if (value === null) {
      this.unset("board");
    } else {
      this.set("board", Value.fromString(value as string));
    }
  }

  get user(): string {
    let value = this.get("user");
    return value.toString();
  }

  set user(value: string) {
    this.set("user", Value.fromString(value));
  }
}

export class Thread extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Thread entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Thread entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Thread", id.toString(), this);
  }

  static load(id: string): Thread | null {
    return store.get("Thread", id) as Thread | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get board(): string | null {
    let value = this.get("board");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set board(value: string | null) {
    if (value === null) {
      this.unset("board");
    } else {
      this.set("board", Value.fromString(value as string));
    }
  }

  get isPinned(): boolean {
    let value = this.get("isPinned");
    return value.toBoolean();
  }

  set isPinned(value: boolean) {
    this.set("isPinned", Value.fromBoolean(value));
  }

  get isLocked(): boolean {
    let value = this.get("isLocked");
    return value.toBoolean();
  }

  set isLocked(value: boolean) {
    this.set("isLocked", Value.fromBoolean(value));
  }

  get op(): string | null {
    let value = this.get("op");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set op(value: string | null) {
    if (value === null) {
      this.unset("op");
    } else {
      this.set("op", Value.fromString(value as string));
    }
  }

  get n(): BigInt {
    let value = this.get("n");
    return value.toBigInt();
  }

  set n(value: BigInt) {
    this.set("n", Value.fromBigInt(value));
  }

  get subject(): string {
    let value = this.get("subject");
    return value.toString();
  }

  set subject(value: string) {
    this.set("subject", Value.fromString(value));
  }

  get replies(): Array<string | null> {
    let value = this.get("replies");
    return value.toStringArray();
  }

  set replies(value: Array<string | null>) {
    this.set("replies", Value.fromStringArray(value));
  }

  get replyCount(): BigInt {
    let value = this.get("replyCount");
    return value.toBigInt();
  }

  set replyCount(value: BigInt) {
    this.set("replyCount", Value.fromBigInt(value));
  }

  get imageCount(): BigInt {
    let value = this.get("imageCount");
    return value.toBigInt();
  }

  set imageCount(value: BigInt) {
    this.set("imageCount", Value.fromBigInt(value));
  }

  get createdAtBlock(): string {
    let value = this.get("createdAtBlock");
    return value.toString();
  }

  set createdAtBlock(value: string) {
    this.set("createdAtBlock", Value.fromString(value));
  }

  get createdAt(): BigInt {
    let value = this.get("createdAt");
    return value.toBigInt();
  }

  set createdAt(value: BigInt) {
    this.set("createdAt", Value.fromBigInt(value));
  }

  get lastBumpedAtBlock(): string {
    let value = this.get("lastBumpedAtBlock");
    return value.toString();
  }

  set lastBumpedAtBlock(value: string) {
    this.set("lastBumpedAtBlock", Value.fromString(value));
  }

  get lastBumpedAt(): BigInt {
    let value = this.get("lastBumpedAt");
    return value.toBigInt();
  }

  set lastBumpedAt(value: BigInt) {
    this.set("lastBumpedAt", Value.fromBigInt(value));
  }

  get score(): BigInt {
    let value = this.get("score");
    return value.toBigInt();
  }

  set score(value: BigInt) {
    this.set("score", Value.fromBigInt(value));
  }
}

export class ThreadCreationEvent extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save ThreadCreationEvent entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save ThreadCreationEvent entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("ThreadCreationEvent", id.toString(), this);
  }

  static load(id: string): ThreadCreationEvent | null {
    return store.get("ThreadCreationEvent", id) as ThreadCreationEvent | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get thread(): string | null {
    let value = this.get("thread");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set thread(value: string | null) {
    if (value === null) {
      this.unset("thread");
    } else {
      this.set("thread", Value.fromString(value as string));
    }
  }

  get user(): string {
    let value = this.get("user");
    return value.toString();
  }

  set user(value: string) {
    this.set("user", Value.fromString(value));
  }
}

export class Post extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Post entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Post entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Post", id.toString(), this);
  }

  static load(id: string): Post | null {
    return store.get("Post", id) as Post | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get thread(): string | null {
    let value = this.get("thread");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set thread(value: string | null) {
    if (value === null) {
      this.unset("thread");
    } else {
      this.set("thread", Value.fromString(value as string));
    }
  }

  get board(): string | null {
    let value = this.get("board");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set board(value: string | null) {
    if (value === null) {
      this.unset("board");
    } else {
      this.set("board", Value.fromString(value as string));
    }
  }

  get n(): BigInt {
    let value = this.get("n");
    return value.toBigInt();
  }

  set n(value: BigInt) {
    this.set("n", Value.fromBigInt(value));
  }

  get name(): string | null {
    let value = this.get("name");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set name(value: string | null) {
    if (value === null) {
      this.unset("name");
    } else {
      this.set("name", Value.fromString(value as string));
    }
  }

  get from(): string {
    let value = this.get("from");
    return value.toString();
  }

  set from(value: string) {
    this.set("from", Value.fromString(value));
  }

  get comment(): string {
    let value = this.get("comment");
    return value.toString();
  }

  set comment(value: string) {
    this.set("comment", Value.fromString(value));
  }

  get image(): string | null {
    let value = this.get("image");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set image(value: string | null) {
    if (value === null) {
      this.unset("image");
    } else {
      this.set("image", Value.fromString(value as string));
    }
  }

  get createdAtBlock(): string {
    let value = this.get("createdAtBlock");
    return value.toString();
  }

  set createdAtBlock(value: string) {
    this.set("createdAtBlock", Value.fromString(value));
  }

  get createdAt(): BigInt {
    let value = this.get("createdAt");
    return value.toBigInt();
  }

  set createdAt(value: BigInt) {
    this.set("createdAt", Value.fromBigInt(value));
  }

  get bans(): Array<string> {
    let value = this.get("bans");
    return value.toStringArray();
  }

  set bans(value: Array<string>) {
    this.set("bans", Value.fromStringArray(value));
  }

  get score(): BigInt {
    let value = this.get("score");
    return value.toBigInt();
  }

  set score(value: BigInt) {
    this.set("score", Value.fromBigInt(value));
  }

  get sage(): boolean {
    let value = this.get("sage");
    return value.toBoolean();
  }

  set sage(value: boolean) {
    this.set("sage", Value.fromBoolean(value));
  }
}

export class PostCreationEvent extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save PostCreationEvent entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save PostCreationEvent entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("PostCreationEvent", id.toString(), this);
  }

  static load(id: string): PostCreationEvent | null {
    return store.get("PostCreationEvent", id) as PostCreationEvent | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get post(): string | null {
    let value = this.get("post");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set post(value: string | null) {
    if (value === null) {
      this.unset("post");
    } else {
      this.set("post", Value.fromString(value as string));
    }
  }

  get user(): string {
    let value = this.get("user");
    return value.toString();
  }

  set user(value: string) {
    this.set("user", Value.fromString(value));
  }
}

export class Report extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Report entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Report entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Report", id.toString(), this);
  }

  static load(id: string): Report | null {
    return store.get("Report", id) as Report | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get createdAtBlock(): string {
    let value = this.get("createdAtBlock");
    return value.toString();
  }

  set createdAtBlock(value: string) {
    this.set("createdAtBlock", Value.fromString(value));
  }

  get createdAt(): BigInt {
    let value = this.get("createdAt");
    return value.toBigInt();
  }

  set createdAt(value: BigInt) {
    this.set("createdAt", Value.fromBigInt(value));
  }

  get reason(): string {
    let value = this.get("reason");
    return value.toString();
  }

  set reason(value: string) {
    this.set("reason", Value.fromString(value));
  }

  get from(): string {
    let value = this.get("from");
    return value.toString();
  }

  set from(value: string) {
    this.set("from", Value.fromString(value));
  }
}

export class PostReport extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save PostReport entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save PostReport entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("PostReport", id.toString(), this);
  }

  static load(id: string): PostReport | null {
    return store.get("PostReport", id) as PostReport | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get post(): string | null {
    let value = this.get("post");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set post(value: string | null) {
    if (value === null) {
      this.unset("post");
    } else {
      this.set("post", Value.fromString(value as string));
    }
  }

  get report(): string {
    let value = this.get("report");
    return value.toString();
  }

  set report(value: string) {
    this.set("report", Value.fromString(value));
  }
}

export class BoardReport extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save BoardReport entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save BoardReport entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("BoardReport", id.toString(), this);
  }

  static load(id: string): BoardReport | null {
    return store.get("BoardReport", id) as BoardReport | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get board(): string | null {
    let value = this.get("board");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set board(value: string | null) {
    if (value === null) {
      this.unset("board");
    } else {
      this.set("board", Value.fromString(value as string));
    }
  }

  get report(): string {
    let value = this.get("report");
    return value.toString();
  }

  set report(value: string) {
    this.set("report", Value.fromString(value));
  }
}

export class Ban extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Ban entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Ban entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Ban", id.toString(), this);
  }

  static load(id: string): Ban | null {
    return store.get("Ban", id) as Ban | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get user(): string {
    let value = this.get("user");
    return value.toString();
  }

  set user(value: string) {
    this.set("user", Value.fromString(value));
  }

  get issuedAtBlock(): string {
    let value = this.get("issuedAtBlock");
    return value.toString();
  }

  set issuedAtBlock(value: string) {
    this.set("issuedAtBlock", Value.fromString(value));
  }

  get issuedAt(): BigInt {
    let value = this.get("issuedAt");
    return value.toBigInt();
  }

  set issuedAt(value: BigInt) {
    this.set("issuedAt", Value.fromBigInt(value));
  }

  get expiresAt(): BigInt {
    let value = this.get("expiresAt");
    return value.toBigInt();
  }

  set expiresAt(value: BigInt) {
    this.set("expiresAt", Value.fromBigInt(value));
  }

  get reason(): string {
    let value = this.get("reason");
    return value.toString();
  }

  set reason(value: string) {
    this.set("reason", Value.fromString(value));
  }

  get from(): string {
    let value = this.get("from");
    return value.toString();
  }

  set from(value: string) {
    this.set("from", Value.fromString(value));
  }
}

export class UserBan extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save UserBan entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save UserBan entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("UserBan", id.toString(), this);
  }

  static load(id: string): UserBan | null {
    return store.get("UserBan", id) as UserBan | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get user(): string {
    let value = this.get("user");
    return value.toString();
  }

  set user(value: string) {
    this.set("user", Value.fromString(value));
  }

  get ban(): string {
    let value = this.get("ban");
    return value.toString();
  }

  set ban(value: string) {
    this.set("ban", Value.fromString(value));
  }
}

export class BoardBan extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save BoardBan entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save BoardBan entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("BoardBan", id.toString(), this);
  }

  static load(id: string): BoardBan | null {
    return store.get("BoardBan", id) as BoardBan | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get user(): string {
    let value = this.get("user");
    return value.toString();
  }

  set user(value: string) {
    this.set("user", Value.fromString(value));
  }

  get board(): string | null {
    let value = this.get("board");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set board(value: string | null) {
    if (value === null) {
      this.unset("board");
    } else {
      this.set("board", Value.fromString(value as string));
    }
  }

  get ban(): string {
    let value = this.get("ban");
    return value.toString();
  }

  set ban(value: string) {
    this.set("ban", Value.fromString(value));
  }
}

export class PostBan extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save PostBan entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save PostBan entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("PostBan", id.toString(), this);
  }

  static load(id: string): PostBan | null {
    return store.get("PostBan", id) as PostBan | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get user(): string {
    let value = this.get("user");
    return value.toString();
  }

  set user(value: string) {
    this.set("user", Value.fromString(value));
  }

  get post(): string | null {
    let value = this.get("post");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set post(value: string | null) {
    if (value === null) {
      this.unset("post");
    } else {
      this.set("post", Value.fromString(value as string));
    }
  }

  get ban(): string {
    let value = this.get("ban");
    return value.toString();
  }

  set ban(value: string) {
    this.set("ban", Value.fromString(value));
  }
}

export class User extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save User entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save User entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("User", id.toString(), this);
  }

  static load(id: string): User | null {
    return store.get("User", id) as User | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get address(): string {
    let value = this.get("address");
    return value.toString();
  }

  set address(value: string) {
    this.set("address", Value.fromString(value));
  }

  get lastPostedAtBlock(): string | null {
    let value = this.get("lastPostedAtBlock");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set lastPostedAtBlock(value: string | null) {
    if (value === null) {
      this.unset("lastPostedAtBlock");
    } else {
      this.set("lastPostedAtBlock", Value.fromString(value as string));
    }
  }

  get bans(): Array<string> {
    let value = this.get("bans");
    return value.toStringArray();
  }

  set bans(value: Array<string>) {
    this.set("bans", Value.fromStringArray(value));
  }

  get jannies(): Array<string> {
    let value = this.get("jannies");
    return value.toStringArray();
  }

  set jannies(value: Array<string>) {
    this.set("jannies", Value.fromStringArray(value));
  }

  get score(): BigInt {
    let value = this.get("score");
    return value.toBigInt();
  }

  set score(value: BigInt) {
    this.set("score", Value.fromBigInt(value));
  }
}

export class Admin extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Admin entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Admin entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Admin", id.toString(), this);
  }

  static load(id: string): Admin | null {
    return store.get("Admin", id) as Admin | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get grantedAtBlock(): string {
    let value = this.get("grantedAtBlock");
    return value.toString();
  }

  set grantedAtBlock(value: string) {
    this.set("grantedAtBlock", Value.fromString(value));
  }

  get grantedAt(): BigInt {
    let value = this.get("grantedAt");
    return value.toBigInt();
  }

  set grantedAt(value: BigInt) {
    this.set("grantedAt", Value.fromBigInt(value));
  }
}

export class BoardJanny extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save BoardJanny entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save BoardJanny entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("BoardJanny", id.toString(), this);
  }

  static load(id: string): BoardJanny | null {
    return store.get("BoardJanny", id) as BoardJanny | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get user(): string {
    let value = this.get("user");
    return value.toString();
  }

  set user(value: string) {
    this.set("user", Value.fromString(value));
  }

  get board(): string | null {
    let value = this.get("board");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set board(value: string | null) {
    if (value === null) {
      this.unset("board");
    } else {
      this.set("board", Value.fromString(value as string));
    }
  }

  get grantedAtBlock(): string {
    let value = this.get("grantedAtBlock");
    return value.toString();
  }

  set grantedAtBlock(value: string) {
    this.set("grantedAtBlock", Value.fromString(value));
  }

  get grantedAt(): BigInt {
    let value = this.get("grantedAt");
    return value.toBigInt();
  }

  set grantedAt(value: BigInt) {
    this.set("grantedAt", Value.fromBigInt(value));
  }
}

export class Image extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Image entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Image entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Image", id.toString(), this);
  }

  static load(id: string): Image | null {
    return store.get("Image", id) as Image | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get name(): string {
    let value = this.get("name");
    return value.toString();
  }

  set name(value: string) {
    this.set("name", Value.fromString(value));
  }

  get byteSize(): BigInt {
    let value = this.get("byteSize");
    return value.toBigInt();
  }

  set byteSize(value: BigInt) {
    this.set("byteSize", Value.fromBigInt(value));
  }

  get ipfsHash(): string {
    let value = this.get("ipfsHash");
    return value.toString();
  }

  set ipfsHash(value: string) {
    this.set("ipfsHash", Value.fromString(value));
  }

  get isNsfw(): boolean {
    let value = this.get("isNsfw");
    return value.toBoolean();
  }

  set isNsfw(value: boolean) {
    this.set("isNsfw", Value.fromBoolean(value));
  }

  get isSpoiler(): boolean {
    let value = this.get("isSpoiler");
    return value.toBoolean();
  }

  set isSpoiler(value: boolean) {
    this.set("isSpoiler", Value.fromBoolean(value));
  }

  get score(): BigInt {
    let value = this.get("score");
    return value.toBigInt();
  }

  set score(value: BigInt) {
    this.set("score", Value.fromBigInt(value));
  }
}

export class ChanStatus extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save ChanStatus entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save ChanStatus entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("ChanStatus", id.toString(), this);
  }

  static load(id: string): ChanStatus | null {
    return store.get("ChanStatus", id) as ChanStatus | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get isLocked(): boolean {
    let value = this.get("isLocked");
    return value.toBoolean();
  }

  set isLocked(value: boolean) {
    this.set("isLocked", Value.fromBoolean(value));
  }
}

export class Block extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Block entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Block entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Block", id.toString(), this);
  }

  static load(id: string): Block | null {
    return store.get("Block", id) as Block | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get number(): BigInt {
    let value = this.get("number");
    return value.toBigInt();
  }

  set number(value: BigInt) {
    this.set("number", Value.fromBigInt(value));
  }
}

export class Client extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Client entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Client entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Client", id.toString(), this);
  }

  static load(id: string): Client | null {
    return store.get("Client", id) as Client | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get version(): string {
    let value = this.get("version");
    return value.toString();
  }

  set version(value: string) {
    this.set("version", Value.fromString(value));
  }

  get channel(): string {
    let value = this.get("channel");
    return value.toString();
  }

  set channel(value: string) {
    this.set("channel", Value.fromString(value));
  }

  get ipfsHash(): string {
    let value = this.get("ipfsHash");
    return value.toString();
  }

  set ipfsHash(value: string) {
    this.set("ipfsHash", Value.fromString(value));
  }

  get publishedAtBlock(): string {
    let value = this.get("publishedAtBlock");
    return value.toString();
  }

  set publishedAtBlock(value: string) {
    this.set("publishedAtBlock", Value.fromString(value));
  }

  get publishedAt(): BigInt {
    let value = this.get("publishedAt");
    return value.toBigInt();
  }

  set publishedAt(value: BigInt) {
    this.set("publishedAt", Value.fromBigInt(value));
  }
}
