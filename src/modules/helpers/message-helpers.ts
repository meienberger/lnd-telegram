import { AuthenticatedLnd, getChannels, getNode } from 'lightning';

const getChannelNames = async (inId: string, outId: string, lnd: AuthenticatedLnd) => {
  const { channels } = await getChannels({ lnd });

  const inChannel = channels.find(channel => channel.id === inId)?.partner_public_key;
  const outChannel = channels.find(channel => channel.id === outId)?.partner_public_key;

  const node1 = await getNode({ lnd, public_key: inChannel || '', is_omitting_channels: true });
  const node2 = await getNode({ lnd, public_key: outChannel || '', is_omitting_channels: true });

  return {
    in: node1.alias || inChannel?.slice(0, 8) || 'unknown',
    out: node2.alias || outChannel?.slice(0, 8) || 'unknown',
  };
};

export { getChannelNames };
