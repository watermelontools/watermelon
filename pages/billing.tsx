import { useState, useEffect } from "react"

const Billing = () => {
    const [subscriptionPlan, setSubscriptionPlan] = useState('starter') // starter, growth, professional, enterprise

    useEffect(() => {
        const workspaceSize = 49; // hardcoded becuase there's no endpoint to fetch this, yet
        // TODO: Get workspace size here
        
        if (workspaceSize < 50) {
            setSubscriptionPlan('starter')
        } else if (workspaceSize >= 50 && workspaceSize < 150) {
            setSubscriptionPlan('growth')
        } else if (workspaceSize >= 150 && workspaceSize < 300) {
            setSubscriptionPlan('professional')
        } else {
            setSubscriptionPlan('enterprise')
        }
    }, [])

    if (subscriptionPlan === 'starter') {
        return (
            <div>
                <form action="/create-checkout-session" method="POST">
                    <input type="hidden" name="priceId" value="price_1JBoctCM8rWyG1fMI81JlAdv" />
                    <button type="submit">Checkout</button>
                </form>
            </div>
        )
    } else if (subscriptionPlan === 'growth') {
        return (
            <div>
                <form action="/create-checkout-session" method="POST">
                    <input type="hidden" name="priceId" value="price_1JBolACM8rWyG1fMgvUpYKzg" />
                    <button type="submit">Checkout</button>
                </form>
            </div>          
        )
    } else if (subscriptionPlan === 'professional') {
        return (
            <div>
                <form action="/create-checkout-session" method="POST">
                    <input type="hidden" name="priceId" value="price_1JBolhCM8rWyG1fMywszzUnB" />
                    <button type="submit">Checkout</button>
                </form>
            </div>
        )
    } else if (subscriptionPlan === 'enterprise') {
        return(
            <div>
                <form action="/create-checkout-session" method="POST">
                    <input type="hidden" name="priceId" value="price_1JBqgWCM8rWyG1fM6aVk0xUn" />
                    <button type="submit">Checkout</button>
                </form>
                <p>Or contact us to get a customized pricing offer</p>
            </div>
        )
    }
}

export default Billing