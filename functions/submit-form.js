export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        // Parse form data
        const data = await request.json();

        // Verify Turnstile token
        const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                secret: env.TURNSTILE_SECRET_KEY,
                response: data['cf-turnstile-response']
            })
        });
        const turnstileResult = await turnstileResponse.json();


        console.log("Turnstile Response Log:", turnstileResult);
        
        if (!turnstileResult.success) {
            return new Response(JSON.stringify({ message: 'Please complete captcha.' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 400
            });
        }
        
        const { 'cf-turnstile-response': _, ...formDataWithoutTurnstile } = data;

        // Save form data to KV (excluding Turnstile response)
        await env.FORM_SUBMISSIONS.put(Date.now().toString(), JSON.stringify(formDataWithoutTurnstile));
        
        console.log("Submitted to KV");

        // Send email using Mailgun
        const mailgunResponse = await fetch(`https://api.eu.mailgun.net/v3/${env.MAILGUN_DOMAIN}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${btoa(`api:${env.MAILGUN_API_KEY}`)}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                from: `Form Submission <forms@${env.MAILGUN_DOMAIN}>`,
                to: 'cole@zactmedia.co.uk',
                subject: 'New Form Submission',
                text: `You have a new form submission for Murphys Groundworks:\n\n${JSON.stringify(formDataWithoutTurnstile, null, 2)}`,
            }),
        });

        if (!mailgunResponse.ok) {
          console.log("ERROR: Failed to send email");
            throw new Error('Failed to send email');
            
        }

        
        return new Response(JSON.stringify({ message: 'Form submitted successfully!' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });
    } catch (error) {
        console.error("Error in Mailgun Request:", error);
        return new Response(JSON.stringify({ message: 'An error occurred while processing your request.' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
}