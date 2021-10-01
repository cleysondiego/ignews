import { Session } from 'next-auth';
import { useSession, signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';

import styles from './styles.module.scss';

interface SessionLocal extends Session {
  activeSubscription?: boolean;
}

export function SubscribeButton() {
  const [session] = useSession();

  const sessionLocal: SessionLocal = session;
  const router = useRouter();

  async function handleSubscribe() {
    if (!sessionLocal) {
      signIn('github');
      return;
    }

    if (sessionLocal.activeSubscription) {
      router.push('/posts');
      return;
    }

    try {
      const response = await api.post('/subscribe')

      const { sessionId } = response.data;

      const stripe = await getStripeJs()

      await stripe.redirectToCheckout({ sessionId});
    } catch(err) {
      alert(err.message);
    }
  }

  return (
    <button
      type="submit"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}