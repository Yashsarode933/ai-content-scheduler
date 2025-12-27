import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const now = new Date().toISOString()
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()

    // Fetch posts scheduled for now
    const { data: posts, error } = await supabaseClient
      .from('posts')
      .select('*')
      .eq('status', 'scheduled')
      .gte('scheduled_at', fiveMinutesAgo)
      .lte('scheduled_at', now)

    if (error) throw error

    // Process each post
    const results = []
    for (const post of posts || []) {
      try {
        // Update post status to published
        await supabaseClient
          .from('posts')
          .update({ status: 'published' })
          .eq('id', post.id)

        // Here you would call actual social media APIs
        // For now, we'll just log
        console.log(`Publishing post ${post.id} to platforms: ${post.platforms.join(', ')}`)

        results.push({ postId: post.id, status: 'published' })
      } catch (err) {
        console.error(`Error publishing post ${post.id}:`, err)
        results.push({ postId: post.id, status: 'error', error: err.message })
      }
    }

    return new Response(
      JSON.stringify({ success: true, processed: results.length, results }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

