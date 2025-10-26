const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { models } = require('../models');
const { User } = models;
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// 회원가입
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Register attempt for:', email);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password_hash: hashedPassword });
    console.log('User registered successfully:', user.id);
    res.status(201).json({ id: user.id, email: user.email });
  } catch (error) {
    console.error('Registration error:', error.message);
    if (error.name === 'SequelizeUniqueConstraintError') {
      console.error('Unique constraint error details:', error.fields);
      return res.status(400).json({ error: '이미 사용 중인 이메일입니다.' });
    }
    res.status(400).json({ error: error.message });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 웹 푸시 알림 구독 정보 저장
router.post('/subscribe', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const subscription = req.body;

    await User.update({ push_subscription: subscription }, { where: { id: userId } });

    res.status(200).json({ message: 'Subscription saved.' });

    // TODO: Implement sending a test push notification
    // const webpush = require('web-push');
    // webpush.sendNotification(subscription, 'Push notification test!').catch(err => console.error(err));

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;