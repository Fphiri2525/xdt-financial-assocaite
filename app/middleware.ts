// routes/users.js (Express backend)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // ... your existing auth logic ...
    
    const token = jwt.sign({ user_id: user.user_id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // ✅ Set HttpOnly cookie from server (not readable by JS)
    res.cookie('token', token, {
      httpOnly: true,       // ← JS cannot read this
      secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });

    res.cookie('userRole', user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ✅ Send user data in response body (no token in body)
    res.json({
      message: 'Login successful',
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      // Don't send token in body anymore
    });

  } catch (error) {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});