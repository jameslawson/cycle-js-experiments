import chai from 'chai';
import chaiImmutable from 'chai-immutable';
import snabbdomChai from 'snabbdom-chai';
import toState from '../src/model/util/toState';

chai.use(chaiImmutable);
chai.use(snabbdomChai);

global.expect = chai.expect;
global.toState = toState;
