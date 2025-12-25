export default function ProjectCard({ project }) {
    return (
      <div className="bg-white rounded-2xl shadow hover:shadow-lg transition p-5">
        <img
          src={project.image}
          alt={project.title}
          className="h-40 w-full object-cover rounded-xl mb-4"
        />
  
        <h3 className="font-bold text-lg">{project.title}</h3>
        <p className="text-sm text-gray-600 mt-2">
          {project.description}
        </p>
  
        <div className="mt-4">
          <div className="flex justify-between text-sm">
            <span>تم جمع</span>
            <span className="font-semibold">{project.percent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{ width: `${project.percent}%` }}
            />
          </div>
        </div>
  
        <div className="flex justify-between mt-4 text-sm text-gray-500">
          <span>⏳ {project.daysLeft} يوم</span>
          <button className="text-indigo-600 font-medium hover:underline">
            تصويت
          </button>
        </div>
      </div>
    );
  }
  