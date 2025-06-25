export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  text: string;
  time: string;
  type: 'sent' | 'received';
  isRead?: boolean;
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    avatar:
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isOnline: true,
    lastMessage: 'Hey, how are you doing?',
    lastMessageTime: '10:30 AM',
    unreadCount: 2
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    avatar:
      'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isOnline: true,
    lastMessage: 'Can we meet tomorrow?',
    lastMessageTime: 'Yesterday',
    unreadCount: 0
  },
  {
    id: '3',
    name: 'Michael Chen',
    avatar:
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isOnline: false,
    lastMessage: 'The project is looking great!',
    lastMessageTime: 'Yesterday',
    unreadCount: 0
  },
  {
    id: '4',
    name: 'Emily Davis',
    avatar:
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isOnline: false,
    lastMessage: 'Thanks for your help with the project',
    lastMessageTime: 'Monday',
    unreadCount: 0
  },
  {
    id: '5',
    name: 'David Wilson',
    avatar:
      'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isOnline: true,
    lastMessage: 'Did you see the latest update?',
    lastMessageTime: 'Sunday',
    unreadCount: 3
  },
  {
    id: '6',
    name: 'Sophie Miller',
    avatar:
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isOnline: false,
    lastMessage: "Let's catch up sometime",
    lastMessageTime: 'Last week',
    unreadCount: 0
  },
  {
    id: '7',
    name: 'Work Group',
    avatar:
      'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isOnline: false,
    lastMessage: 'Alex: We need to finish the presentation',
    lastMessageTime: 'Last week',
    unreadCount: 0
  },
  {
    id: '8',
    name: 'Thomas Brown',
    avatar:
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isOnline: false,
    lastMessage: "How's the new apartment?",
    lastMessageTime: '2 weeks ago',
    unreadCount: 0
  }
];

export const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1-1',
      text: 'Hey there! How are you doing?',
      time: '10:00 AM',
      type: 'received'
    },
    {
      id: 'm1-2',
      text: "I'm good, thanks for asking! Just working on some new projects.",
      time: '10:05 AM',
      type: 'sent',
      isRead: true
    },
    {
      id: 'm1-3',
      text: 'That sounds interesting! What kind of projects?',
      time: '10:10 AM',
      type: 'received'
    },
    {
      id: 'm1-4',
      text: "Mostly web development stuff. I'm learning React and building some cool apps.",
      time: '10:15 AM',
      type: 'sent',
      isRead: true
    },
    {
      id: 'm1-5',
      text: "React is awesome! I've been using it for a while now.",
      time: '10:20 AM',
      type: 'received'
    },
    {
      id: 'm1-6',
      text: 'Any tips for a beginner?',
      time: '10:25 AM',
      type: 'sent',
      isRead: true
    },
    {
      id: 'm1-7',
      text: "Start with the basics and build small projects first. Also, make sure you understand hooks well - they're super useful!",
      time: '10:30 AM',
      type: 'received'
    }
  ],
  '2': [
    {
      id: 'm2-1',
      text: 'Hi there! Are you free tomorrow for the meeting?',
      time: 'Yesterday, 2:00 PM',
      type: 'received'
    },
    {
      id: 'm2-2',
      text: 'Hey Sarah! Yes, I should be available. What time were you thinking?',
      time: 'Yesterday, 2:10 PM',
      type: 'sent',
      isRead: true
    },
    {
      id: 'm2-3',
      text: 'How about 10 AM? We can discuss the new project proposal.',
      time: 'Yesterday, 2:15 PM',
      type: 'received'
    },
    {
      id: 'm2-4',
      text: '10 AM works perfectly for me. Should I prepare anything specific?',
      time: 'Yesterday, 2:20 PM',
      type: 'sent',
      isRead: true
    },
    {
      id: 'm2-5',
      text: "Just bring your ideas! We'll go through the requirements together.",
      time: 'Yesterday, 2:25 PM',
      type: 'received'
    },
    {
      id: 'm2-6',
      text: 'Perfect! See you tomorrow then.',
      time: 'Yesterday, 2:30 PM',
      type: 'sent',
      isRead: true
    },
    {
      id: 'm2-7',
      text: 'Looking forward to it! Have a great day.',
      time: 'Yesterday, 2:35 PM',
      type: 'received'
    }
  ],
  '3': [
    {
      id: 'm3-1',
      text: 'Hey, have you checked out the latest designs?',
      time: 'Monday, 9:00 AM',
      type: 'received'
    },
    {
      id: 'm3-2',
      text: 'Yes, I looked at them yesterday. The UI looks very clean!',
      time: 'Monday, 9:30 AM',
      type: 'sent',
      isRead: true
    },
    {
      id: 'm3-3',
      text: 'Great! What do you think about the color scheme?',
      time: 'Monday, 10:00 AM',
      type: 'received'
    },
    {
      id: 'm3-4',
      text: 'I really like it. The blue and white combination looks professional and modern.',
      time: 'Monday, 10:15 AM',
      type: 'sent',
      isRead: true
    },
    {
      id: 'm3-5',
      text: "That's what we were going for! The client seems happy with the direction so far.",
      time: 'Monday, 10:30 AM',
      type: 'received'
    },
    {
      id: 'm3-6',
      text: "That's great news! Let me know if you need any help with the implementation.",
      time: 'Monday, 10:45 AM',
      type: 'sent',
      isRead: true
    }
  ],
  '4': [
    {
      id: 'm4-1',
      text: 'Thanks for helping me with that debugging issue yesterday!',
      time: 'Monday, 11:00 AM',
      type: 'received'
    },
    {
      id: 'm4-2',
      text: 'No problem at all! Was happy to help.',
      time: 'Monday, 11:15 AM',
      type: 'sent',
      isRead: true
    },
    {
      id: 'm4-3',
      text: "I've been stuck on that for days. How did you figure it out so quickly?",
      time: 'Monday, 11:30 AM',
      type: 'received'
    },
    {
      id: 'm4-4',
      text: "I've encountered a similar issue before. Once you know what to look for, these problems become easier to spot.",
      time: 'Monday, 11:45 AM',
      type: 'sent',
      isRead: true
    },
    {
      id: 'm4-5',
      text: 'Well, I appreciate it. Let me know if you ever need help with anything!',
      time: 'Monday, 12:00 PM',
      type: 'received'
    },
    {
      id: 'm4-6',
      text: "Will do! How's the rest of the project coming along?",
      time: 'Monday, 12:15 PM',
      type: 'sent',
      isRead: true
    }
  ],
  '5': [
    {
      id: 'm5-1',
      text: 'Have you seen the latest update to the framework?',
      time: 'Sunday, 3:00 PM',
      type: 'received'
    },
    {
      id: 'm5-2',
      text: "Not yet! What's new in this version?",
      time: 'Sunday, 3:30 PM',
      type: 'sent',
      isRead: true
    },
    {
      id: 'm5-3',
      text: "They've completely redesigned the API. It's much cleaner now!",
      time: 'Sunday, 3:45 PM',
      type: 'received'
    },
    {
      id: 'm5-4',
      text: 'That sounds promising. Is it a breaking change? Will we need to refactor our code?',
      time: 'Sunday, 4:00 PM',
      type: 'sent',
      isRead: true
    },
    {
      id: 'm5-5',
      text: "It is breaking, but they provide a migration guide. It shouldn't be too difficult.",
      time: 'Sunday, 4:15 PM',
      type: 'received'
    },
    {
      id: 'm5-6',
      text: "Great! I'll take a look at it this week.",
      time: 'Sunday, 4:30 PM',
      type: 'sent',
      isRead: false
    },
    {
      id: 'm5-7',
      text: "By the way, they also improved performance by about 30%. It's pretty impressive!",
      time: 'Today, 9:00 AM',
      type: 'received'
    },
    {
      id: 'm5-8',
      text: "And they added some new features that we've been waiting for.",
      time: 'Today, 9:05 AM',
      type: 'received'
    },
    {
      id: 'm5-9',
      text: "Let me know when you've had a chance to check it out.",
      time: 'Today, 9:10 AM',
      type: 'received'
    }
  ],
  '6': [
    {
      id: 'm6-1',
      text: "Hey! It's been a while. How have you been?",
      time: 'Last week',
      type: 'received'
    },
    {
      id: 'm6-2',
      text: "Hi Sophie! I've been good, just really busy with work. How about you?",
      time: 'Last week',
      type: 'sent',
      isRead: true
    },
    {
      id: 'm6-3',
      text: 'Same here! Work has been crazy. We should catch up sometime soon.',
      time: 'Last week',
      type: 'received'
    },
    {
      id: 'm6-4',
      text: 'Definitely! Are you free for coffee this weekend?',
      time: 'Last week',
      type: 'sent',
      isRead: true
    },
    {
      id: 'm6-5',
      text: "I'm traveling this weekend, but maybe next week?",
      time: 'Last week',
      type: 'received'
    },
    {
      id: 'm6-6',
      text: "Next week works for me. Let's plan for Tuesday or Wednesday.",
      time: 'Last week',
      type: 'sent',
      isRead: true
    },
    {
      id: 'm6-7',
      text: "Perfect! I'll check my schedule and let you know.",
      time: 'Last week',
      type: 'received'
    }
  ],
  '7': [
    {
      id: 'm7-1',
      text: "Team, let's discuss the quarterly report tomorrow.",
      time: 'Last week',
      type: 'received'
    },
    {
      id: 'm7-2',
      text: "Alex: I've prepared most of the slides already.",
      time: 'Last week',
      type: 'received'
    },
    {
      id: 'm7-3',
      text: "That's great! Is there anything specific I should prepare?",
      time: 'Last week',
      type: 'sent',
      isRead: true
    },
    {
      id: 'm7-4',
      text: "Maria: Could you go over the financial section? That's your expertise.",
      time: 'Last week',
      type: 'received'
    },
    {
      id: 'm7-5',
      text: "Sure thing. I'll have it ready by tomorrow morning.",
      time: 'Last week',
      type: 'sent',
      isRead: true
    },
    {
      id: 'm7-6',
      text: "Alex: Perfect! Let's meet at 10 AM then.",
      time: 'Last week',
      type: 'received'
    },
    {
      id: 'm7-7',
      text: 'Sounds good to me!',
      time: 'Last week',
      type: 'sent',
      isRead: true
    }
  ],
  '8': [
    {
      id: 'm8-1',
      text: "Hey, how's the new apartment working out for you?",
      time: '2 weeks ago',
      type: 'received'
    },
    {
      id: 'm8-2',
      text: "It's great! Finally finished unpacking all the boxes last weekend.",
      time: '2 weeks ago',
      type: 'sent',
      isRead: true
    },
    {
      id: 'm8-3',
      text: "That's awesome! How's the neighborhood?",
      time: '2 weeks ago',
      type: 'received'
    },
    {
      id: 'm8-4',
      text: "I love it. There's a nice park nearby and lots of good restaurants within walking distance.",
      time: '2 weeks ago',
      type: 'sent',
      isRead: true
    },
    {
      id: 'm8-5',
      text: 'Sounds perfect! We should have dinner at one of those places soon.',
      time: '2 weeks ago',
      type: 'received'
    },
    {
      id: 'm8-6',
      text: "Definitely! There's this great Italian place I've been wanting to try.",
      time: '2 weeks ago',
      type: 'sent',
      isRead: true
    },
    {
      id: 'm8-7',
      text: "Italian sounds perfect! Let me know when you're free.",
      time: '2 weeks ago',
      type: 'received'
    }
  ]
};
