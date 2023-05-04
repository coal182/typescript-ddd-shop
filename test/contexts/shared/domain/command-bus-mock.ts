import { expect } from 'chai';
import { spy } from 'sinon';

import { Command } from '@shared/domain/command';
import { CommandBus } from '@shared/domain/command-bus';

export default class CommandBusMock implements CommandBus {
  private dispatchSpy = spy();

  async dispatch(command: Command[]) {
    this.dispatchSpy(command);
  }

  assertLastDispatchedCommandIs(expectedCommand: Command) {
    const dispatchSpyCalls = this.dispatchSpy.getCalls();

    expect(dispatchSpyCalls.length).to.be.greaterThan(0);

    const lastPublishSpyCall = dispatchSpyCalls[dispatchSpyCalls.length - 1];
    const lastDispatchedCommand = lastPublishSpyCall.args[0];

    expect(expectedCommand).to.deep.equal(lastDispatchedCommand);
  }
}
