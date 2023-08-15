import { redirect } from 'next/navigation';
export default async function GHApp({ params }) {
    redirect('https://github.com/marketplace/watermelon-context);
}
