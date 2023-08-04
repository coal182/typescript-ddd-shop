'use strict';

import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');
import chaiHttp = require('chai-http');
import sinonChai = require('sinon-chai');

export const expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();
chai.use(chaiHttp);
