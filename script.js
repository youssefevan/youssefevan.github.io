function filterProjects(button, category) {
    const projects = document.querySelectorAll('.project');
    const buttons = document.querySelectorAll('.filters button');

    projects.forEach(project => {
        project.style.display = (category === 'all' || project.classList.contains(category)) ? 'block' : 'none';
    });

    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
}
