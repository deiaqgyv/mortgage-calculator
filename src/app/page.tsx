import { permanentRedirect } from 'next/navigation';

export default function HomePage() {
  permanentRedirect('/en-us/mortgage-calculator');
}
