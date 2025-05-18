import { z } from 'zod';

export const CloseMessageSchema = z.object({
  type: z.string(),
  data: z.array(z.any()),
});
export type CloseMessage = z.infer<typeof CloseMessageSchema>;

export const EventsSchema = z.object({});
export type Events = z.infer<typeof EventsSchema>;

export const WritableStateSchema = z.object({
  highWaterMark: z.number(),
  length: z.number(),
  corked: z.number(),
  writelen: z.number(),
  bufferedIndex: z.number(),
  pendingcb: z.number(),
});
export type WritableState = z.infer<typeof WritableStateSchema>;

export const SocketEventsSchema = z.object({
  close: z.array(z.null()),
  end: z.array(z.null()),
  newListener: z.array(z.null()),
});
export type SocketEvents = z.infer<typeof SocketEventsSchema>;

export const ReadableStateSchema = z.object({
  highWaterMark: z.number(),
  buffer: z.array(z.any()),
  bufferIndex: z.number(),
  length: z.number(),
  pipes: z.array(z.any()),
  awaitDrainWriters: z.null(),
});
export type ReadableState = z.infer<typeof ReadableStateSchema>;

export const ParentSchema = z.object({
  reading: z.boolean(),
  onconnection: z.null(),
});
export type Parent = z.infer<typeof ParentSchema>;

export const SecureContextSchema = z.object({
  context: EventsSchema,
});
export type SecureContext = z.infer<typeof SecureContextSchema>;

export const TlsOptionsSchema = z.object({
  pipe: z.boolean(),
  secureContext: SecureContextSchema,
  isServer: z.boolean(),
  requestCert: z.boolean(),
  rejectUnauthorized: z.boolean(),
});
export type TlsOptions = z.infer<typeof TlsOptionsSchema>;

export const HeadersSchema = z.object({
  'Content-Type': z.string(),
  'X-Client-Info': z.string(),
  'User-Agent': z.string(),
  Authorization: z.string().optional(),
});
export type Headers = z.infer<typeof HeadersSchema>;

export const FetchOptionsSchema = z.object({
  url: z.string(),
  headers: HeadersSchema,
});
export type FetchOptions = z.infer<typeof FetchOptionsSchema>;

export const WebsocketOptionsSchema = z.object({
  url: z.string(),
  _nodeOnlyHeaders: HeadersSchema,
});
export type WebsocketOptions = z.infer<typeof WebsocketOptionsSchema>;

export const ReceiverSchema = z.object({
  _events: EventsSchema,
  _writableState: WritableStateSchema,
  _allowSynchronousEvents: z.boolean(),
  _binaryType: z.string(),
  _extensions: EventsSchema,
  _isServer: z.boolean(),
  _maxPayload: z.number(),
  _skipUTF8Validation: z.boolean(),
  _bufferedBytes: z.number(),
  _buffers: z.array(z.any()),
  _compressed: z.boolean(),
  _payloadLength: z.number(),
  _fragmented: z.number(),
  _masked: z.boolean(),
  _fin: z.boolean(),
  _opcode: z.number(),
  _totalPayloadLength: z.number(),
  _messageLength: z.number(),
  _fragments: z.array(z.any()),
  _errored: z.boolean(),
  _loop: z.boolean(),
  _state: z.number(),
  _eventsCount: z.number(),
});
export type Receiver = z.infer<typeof ReceiverSchema>;

export const SslSchema = z.object({
  _parent: ParentSchema,
  _parentWrap: z.null(),
  _secureContext: SecureContextSchema,
  reading: z.boolean(),
});
export type Ssl = z.infer<typeof SslSchema>;

export const FetchSchema = z.object({
  options: FetchOptionsSchema,
});
export type Fetch = z.infer<typeof FetchSchema>;

export const WebsocketSchema = z.object({
  options: WebsocketOptionsSchema,
});
export type Websocket = z.infer<typeof WebsocketSchema>;

export const SocketSchema = z.object({
  _tlsOptions: TlsOptionsSchema,
  _secureEstablished: z.boolean(),
  _securePending: z.boolean(),
  _newSessionPending: z.boolean(),
  _controlReleased: z.boolean(),
  secureConnecting: z.boolean(),
  _SNICallback: z.null(),
  servername: z.string(),
  alpnProtocol: z.boolean(),
  authorized: z.boolean(),
  authorizationError: z.null(),
  encrypted: z.boolean(),
  _events: SocketEventsSchema,
  _eventsCount: z.number(),
  connecting: z.boolean(),
  _hadError: z.boolean(),
  _parent: z.null(),
  _host: z.string(),
  _closeAfterHandlingError: z.boolean(),
  _readableState: ReadableStateSchema,
  _writableState: WritableStateSchema,
  allowHalfOpen: z.boolean(),
  _sockname: z.null(),
  _pendingData: z.null(),
  _pendingEncoding: z.string(),
  _server: z.null(),
  ssl: SslSchema,
  _requestCert: z.boolean(),
  _rejectUnauthorized: z.boolean(),
  parser: z.null(),
  _httpMessage: z.null(),
  timeout: z.number(),
});
export type Socket = z.infer<typeof SocketSchema>;

export const AgentSchema = z.object({
  fetch: FetchSchema,
  websocket: WebsocketSchema,
});
export type Agent = z.infer<typeof AgentSchema>;

export const SenderSchema = z.object({
  _extensions: EventsSchema,
  _socket: SocketSchema,
  _firstFragment: z.boolean(),
  _compress: z.boolean(),
  _bufferedBytes: z.number(),
  _queue: z.array(z.any()),
  _state: z.number(),
});
export type Sender = z.infer<typeof SenderSchema>;

export const PayloadOptionsSchema = z.object({
  global: AgentSchema,
  agent: AgentSchema,
  key: z.string(),
});
export type PayloadOptions = z.infer<typeof PayloadOptionsSchema>;

export const ConnSchema = z.object({
  _events: EventsSchema,
  _eventsCount: z.number(),
  _binaryType: z.string(),
  _closeCode: z.number(),
  _closeFrameReceived: z.boolean(),
  _closeFrameSent: z.boolean(),
  _closeMessage: CloseMessageSchema,
  _closeTimer: z.null(),
  _errorEmitted: z.boolean(),
  _extensions: EventsSchema,
  _paused: z.boolean(),
  _protocol: z.string(),
  _readyState: z.number(),
  _receiver: ReceiverSchema,
  _sender: SenderSchema,
  _socket: SocketSchema,
  _bufferedAmount: z.number(),
  _isServer: z.boolean(),
  _redirects: z.number(),
  _autoPong: z.boolean(),
  _url: z.string(),
  _req: z.null(),
});
export type Conn = z.infer<typeof ConnSchema>;

export const PayloadSchema = z.object({
  _events: EventsSchema,
  _eventsCount: z.number(),
  namespace: z.string(),
  version: z.string(),
  baseUrl: z.string(),
  key: z.string(),
  options: PayloadOptionsSchema,
  conn: ConnSchema,
  sendBuffer: z.array(z.any()),
  transport: z.null(),
  headers: HeadersSchema,
});
export type Payload = z.infer<typeof PayloadSchema>;

export const TranscriptionEventOpenSchema = z.object({
  streamSid: z.string(),
  payload: PayloadSchema,
});
export type TranscriptionEventOpen = z.infer<typeof TranscriptionEventOpenSchema>;
