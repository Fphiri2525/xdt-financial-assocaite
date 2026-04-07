import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('📡 Calling Express at:', 'http://loan-backend-production-558e.up.railway.app/api/users/login');
    console.log('📦 Request body:', body);

    let response: Response;

    try {
      response = await fetch('http://loan-backend-production-558e.up.railway.app/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (fetchError: any) {
      // ❌ Express server is unreachable
      console.error('❌ Cannot reach Express server:', fetchError.message);
      return NextResponse.json(
        { message: `Cannot connect to backend server. Is Express running on port 5000? Error: ${fetchError.message}` },
        { status: 503 }
      );
    }

    console.log('📬 Express response status:', response.status);
    console.log('📬 Express response content-type:', response.headers.get('content-type'));

    // Read raw text first to see what Express actually returned
    const rawText = await response.text();
    console.log('📬 Express raw response:', rawText.substring(0, 500));

    // Now try to parse as JSON
    let data: any;
    try {
      data = JSON.parse(rawText);
    } catch {
      console.error('❌ Express returned non-JSON:', rawText.substring(0, 200));
      return NextResponse.json(
        { message: `Backend returned invalid response. Check if your Express route /api/users/login exists and returns JSON. Raw response: ${rawText.substring(0, 100)}` },
        { status: 500 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Login failed' },
        { status: response.status }
      );
    }

    // ✅ Check token exists
    if (!data.token) {
      console.error('❌ No token in Express response. Full response:', data);
      return NextResponse.json(
        { message: 'Backend did not return a token. Check your Express login route.' },
        { status: 500 }
      );
    }

    const nextResponse = NextResponse.json({ user: data.user });
    const maxAge = 60 * 60 * 24 * 7;

    nextResponse.cookies.set('token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/',
    });

    nextResponse.cookies.set('userRole', data.user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/',
    });

    return nextResponse;

  } catch (error: any) {
    console.error('❌ Unexpected error in login route:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}ss