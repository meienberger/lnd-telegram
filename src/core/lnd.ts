import { authenticatedLndGrpc } from 'lightning';
import config from '../config';

const { lnd } = authenticatedLndGrpc(config.lnd);

export default lnd;
