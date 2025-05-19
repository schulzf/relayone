import { Close } from './Close';
import { Error } from './Error';
import { Open } from './Open';
import { SpeechStarted } from './SpeechStarted';
import { Transcript } from './Transcript';
import { TranscriptionService } from './TranscriptionService';
import { UtteranceEnded } from './UtteranceEnded';

export const TranscriptionServiceProviders = [Open, Close, Error, Transcript, SpeechStarted, UtteranceEnded, TranscriptionService];
