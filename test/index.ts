'use strict';

import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');
import chaiHttp = require('chai-http');

export const expect = chai.expect;

chai.use(chaiAsPromised);
chai.use(chaiHttp);
