import {
    assert,
    describe,
    test,
    beforeEach,
    clearStore,
  } from "matchstick-as/assembly/index";
import { Address } from "@graphprotocol/graph-ts";
import { handleMessage } from "../../src/relay";
import { createMessageEvent } from "../relay-utils";
import { ChanStatus } from "../../generated/schema";
import { chanStatusId } from "../../src/internal/chan_status";
import { claimAdmin } from "../helpers";

describe("Chan lock", () => {
  beforeEach(() => {
    clearStore();
    claimAdmin();
  });

  test("lock chan", () => {
    const from = Address.fromString("0x0000000000000000000000000000000000000000");
    const jsonMessage = `{"ns": "4dchan.org","v": 0,"op": "chan:lock","data": {}}`;
    const newMessageEvent = createMessageEvent(from, jsonMessage);

    const chanId = chanStatusId(newMessageEvent);
    const chanStatus = new ChanStatus(chanId);
    chanStatus.isLocked = false;
    chanStatus.save();

    assert.fieldEquals("ChanStatus", chanId, "isLocked", "false");

    handleMessage(newMessageEvent);

    assert.fieldEquals("ChanStatus", chanId, "isLocked", "true");
  });

  test("fail to lock chan if already locked", () => {
    const from = Address.fromString("0x0000000000000000000000000000000000000000");
    const jsonMessage = `{"ns": "4dchan.org","v": 0,"op": "chan:lock","data": {}}`;
    const newMessageEvent = createMessageEvent(from, jsonMessage);

    const chanId = chanStatusId(newMessageEvent);
    const chanStatus = new ChanStatus(chanId);
    chanStatus.isLocked = true;
    chanStatus.save();

    assert.fieldEquals("ChanStatus", chanId, "isLocked", "true");

    handleMessage(newMessageEvent);

    assert.fieldEquals("ChanStatus", chanId, "isLocked", "true");
  });

  test("fail to lock chan if not admin", () => {
    const from = Address.fromString("0x0000000000000000000000000000000000000001");
    const jsonMessage = `{"ns": "4dchan.org","v": 0,"op": "chan:lock","data": {}}`;
    const newMessageEvent = createMessageEvent(from, jsonMessage);

    const chanId = chanStatusId(newMessageEvent);
    const chanStatus = new ChanStatus(chanId);
    chanStatus.isLocked = false;
    chanStatus.save();

    assert.fieldEquals("ChanStatus", chanId, "isLocked", "false");

    handleMessage(newMessageEvent);

    assert.fieldEquals("ChanStatus", chanId, "isLocked", "false");
  });
});
