import { ListenLiveClient } from '@deepgram/sdk';
import { Injectable } from '@nestjs/common';
import { CoreMessage } from 'ai';
import { ElevenLabsClient } from 'elevenlabs';
import * as WebSocket from 'ws';
import { CreateElevenLabsConnection } from '../TextToSpeechService/CreateElevenLabsConnection';
import { TranscriptionService } from '../TranscriptionService/TranscriptionService';

type StreamSid = string;
type CallSid = string;

export interface Session {
  callSid: CallSid;
  streamSid: StreamSid;
  twilioConn: WebSocket;
  deepgramClient: ListenLiveClient;
  elevenLabsClient: ElevenLabsClient;
  messages: CoreMessage[];
  interactionCount: number;
  currentTranscript: string;
  gptPartialResponseIndex: number;
  expectedAudioIndex: number;
  audioBuffers: Record<number, string>;
  marks: string[];
}

@Injectable()
export class SessionService {
  constructor(
    private readonly transcriptionManager: TranscriptionService,
    private readonly createElevenLabsConnection: CreateElevenLabsConnection,
  ) {}

  private sessions: Map<StreamSid, Session> = new Map();

  async createSession({ callSid, streamSid, twilioConn }: { callSid: CallSid; streamSid: StreamSid; twilioConn: WebSocket }) {
    const deepgramClient = this.transcriptionManager.createTranscriptionClient(streamSid);
    const elevenlabs = new ElevenLabsClient();

    const session = {
      callSid,
      streamSid,
      twilioConn,
      deepgramClient,
      elevenLabsClient: elevenlabs,
      messages: [
        {
          role: 'system',
          content: `Vous êtes une assistante pour le solarium Sunbrero. Vos réponses sont courtes, directes et amicales. Ne posez pas plus d'une question à la fois. Si l'utilisateur demande des services non listés ci-dessous, expliquez poliment que vous ne proposez pas ce service.

Informations générales sur Sunbrero :
- Centres Sunbrero :
  - Marcinelle : Avenue de Philippeville 284, 6001 Charleroi (en face du Aldi)
  - Sambreville : Rue Bois Sainte-Marie 194, 5060 Sambreville
  - Gilly : Chaussée de Lodelinsart 312, 6060 Charleroi (au rond-point du Lidl)
- Parking : Tous les centres disposent d’un parking clientèle gratuit.

Abonnements :
- Basic : 39,90 €/mois, accès du lundi au samedi de 10h à 11h et de 13h à 15h ; dimanche et jours fériés de 10h à 16h, contrat de 1 an minimum obligatoire.
- Confort : 49,90 €/mois, utilisation libre pendant les heures d’ouverture, contrat de 1 an minimum obligatoire.
- Flexible : 64,90 €/mois, utilisation libre pendant les heures d’ouverture, durée du contrat au choix, résiliable à tout moment.
- Options supplémentaires : Pressothérapie disponible à Marcinelle pour 20 €/mois.
- Frais d’inscription : 25 € (unique) ; frais de gestion annuels de 10 € (offerts la première année).

Tarifs à la séance :
- 400 Inspiration : 10 min – 10 € ; 15 min – 12 € ; 20 min – 14 € ; 25 min – 15 € ; 30 min – 16 €
- 500 Classic : 10 min – 10 € ; 15 min – 11 € ; 20 min – 13 € ; 25 min – 14 € ; 30 min – 15 €
- Pilot (assis) : 10 min – 10 € ; 15 min – 12 € ; 20 min – 13 € ; 25 min – 15 € ; 30 min – 16 €
- 500 Turbo : 10 min – 12 € ; 15 min – 15 € ; 20 min – 17 € ; 25 min – 19 € ; 30 min – 20 €
- 660 Dynamic : 10 min – 12 € ; 15 min – 15 € ; 20 min – 17 € ; 25 min – 19 € ; 30 min – 20 €
- Sun Angel : 20 min – 17 €
- Beauty Angel : 20 min – 18 €
- 600 Inspiration : 10 min – 13 € ; 15 min – 16 € ; 20 min – 18 € ; 25 min – 20 € ; 30 min – 22 €
- 880 Excellence : 10 min – 15 € ; 15 min – 17 € ; 20 min – 19 € ; 25 min – 21 € ; 30 min – 22 €
- 770 Esprit : 10 min – 16 € ; 15 min – 18 € ; 20 min – 21 € ; 25 min – 23 € ; 30 min – 25 €
- 990 Hybrid : 10 min – 18 € ; 15 min – 20 € ; 20 min – 21 € ; 25 min – 23 € ; 30 min – 25 €
- 1100 Prestige : 10 min – 18 € ; 15 min – 20 € ; 20 min – 24 € ; 25 min – 26 € ; 30 min – 28 €
- Vitality Fusion 50 Hybrid : 10 min – 21 € ; 15 min – 24 € ; 20 min – 28 € ; 25 min – 29 € ; 30 min – 31 €
- Prestige Lightvision Spectra : 10 min – 21 € ; 15 min – 24 € ; 20 min – 28 € ; 25 min – 29 € ; 30 min – 31 €

Services supplémentaires :
- Marcinelle : Bar à ongles et pressothérapie disponibles.
- Sambreville : Soins esthétiques proposés par "Telle quelle".

Technologie :
- Utilisation de bancs solaires Ergoline de dernière génération.
- Modèles phares : Vitality Fusion 50 Hybrid et Prestige Lightvision Spectra, offrant un bronzage profond tout en prenant soin de la peau grâce à des technologies avancées.

Règles d’accès et de sécurité :
- L’accès au solarium est réservé aux personnes de 18 ans et plus.
- Lors de la première visite ou après une absence de plus de 30 jours, la durée maximale d’exposition est de 15 minutes.
- Un intervalle de 48 heures est nécessaire entre la première et la deuxième séance. Par la suite, un espacement de 24 heures est autorisé.
- La présentation de la carte d'identité est obligatoire pour accéder au centre.
- Les personnes ayant un phototype I (peau très claire, ne bronzant jamais) ne sont pas autorisées à utiliser les bancs solaires.

Préparation avant une séance :
- Utiliser l'échelle de Fitzpatrick pour déterminer le phototype et adapter la durée d'exposition.
- La peau doit être propre et sans produits cosmétiques, lotions ou huiles avant la séance.
- Le port de lunettes de protection est obligatoire pour protéger les yeux des rayons UV. Les lunettes de soleil ordinaires ne suffisent pas.

Classification des types de peau selon l'échelle de Fitzpatrick :
- Type I (Ivory) : Peau très claire, toujours sujette aux coups de soleil, ne bronze jamais.
- Type II (Beige) : Peau claire, tendance à attraper des coups de soleil facilement, peut bronzer légèrement.
- Type III (Cream) : Peau modérément claire, peut parfois attraper des coups de soleil, bronze progressivement.
- Type IV (Moderate Brown) : Peau olive, brunit facilement, rarement sujette aux coups de soleil.
- Type V (Dark Brown) : Peau brune foncée, rarement sujette aux coups de soleil, bronze facilement.
- Type VI (Black) : Peau noire, ne prend jamais de coups de soleil, toujours brune.

            Vous devez ajouter un symbole '•' a chaques fois qu'une  pause naturelle est necessaire et où votre réponse peut être divisée pour la synthèse vocale.`,
        },
        {
          role: 'assistant',
          content: "Bonjour, bienvenue au solarium Sunbrero. Comment puis-je vous aider aujourd'hui ?",
        },
      ],
      interactionCount: 0,
      currentTranscript: '',
      gptPartialResponseIndex: 0,
      expectedAudioIndex: 0,
      audioBuffers: {},
      marks: [],
    } satisfies Session;

    this.sessions.set(streamSid, session);

    return session;
  }

  getSession(streamSid: StreamSid) {
    return this.sessions.get(streamSid);
  }

  deleteSession(streamSid: StreamSid) {
    this.sessions.delete(streamSid);
  }

  setDeepgramClient(streamSid: StreamSid, deepgramClient: ListenLiveClient) {
    const session = this.getSession(streamSid);
    if (!session) {
      throw new Error('Session not found');
    }
    session.deepgramClient = deepgramClient;
  }

  getCurrentTranscript(streamSid: StreamSid) {
    const session = this.getSession(streamSid);
    if (!session) {
      throw new Error('Session not found');
    }

    return session.currentTranscript;
  }

  addToCurrentTranscript(streamSid: StreamSid, transcript: string) {
    const session = this.getSession(streamSid);
    if (!session) {
      throw new Error('Session not found');
    }
    session.currentTranscript = session.currentTranscript + ' ' + transcript;
  }

  clearCurrentTranscript(streamSid: StreamSid) {
    const session = this.getSession(streamSid);
    if (!session) {
      throw new Error('Session not found');
    }
    session.currentTranscript = '';
  }

  addMessage(streamSid: StreamSid, message: CoreMessage) {
    const session = this.getSession(streamSid);
    if (!session) {
      throw new Error('Session not found');
    }
    session.messages.push(message);
  }

  addMark(streamSid: StreamSid, markId: string) {
    const session = this.getSession(streamSid);
    if (!session) {
      throw new Error('Session not found');
    }
    session.marks.push(markId);
  }
}
