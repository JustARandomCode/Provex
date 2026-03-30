import { Card } from '../ui/Card'

const topics = [
  { id: '1', title: 'Machine Learning', icon: '\u{1F916}', description: 'Neural networks, training, inference', lessons: 12 },
  { id: '2', title: 'Web Development', icon: '\u{1F310}', description: 'HTML, CSS, JavaScript, React', lessons: 18 },
  { id: '3', title: 'Data Structures', icon: '\u{1F333}', description: 'Trees, graphs, hash maps', lessons: 15 },
  { id: '4', title: 'System Design', icon: '\u{1F3D7}\u{FE0F}', description: 'Scalability, load balancing', lessons: 10 },
  { id: '5', title: 'Databases', icon: '\u{1F5C4}\u{FE0F}', description: 'SQL, NoSQL, indexing', lessons: 8 },
  { id: '6', title: 'Operating Systems', icon: '\u{1F4BB}', description: 'Processes, memory, file systems', lessons: 11 },
  { id: '7', title: 'Networking', icon: '\u{1F4E1}', description: 'TCP/IP, HTTP, DNS, protocols', lessons: 9 },
  { id: '8', title: 'Cybersecurity', icon: '\u{1F512}', description: 'Encryption, auth, vulnerabilities', lessons: 7 },
]

export function TopicGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {topics.map((topic) => (
        <Card
          key={topic.id}
          hoverable
          className="text-center cursor-pointer py-5 px-3"
        >
          <div className="text-3xl mb-2">{topic.icon}</div>
          <h3 className="text-sm font-semibold text-white mb-1">{topic.title}</h3>
          <p className="text-[10px] text-text-tertiary mb-2">{topic.description}</p>
          <span className="text-[10px] text-primary-light font-medium">
            {topic.lessons} lessons
          </span>
        </Card>
      ))}
    </div>
  )
}
