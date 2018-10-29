const events = require('events');
const fs = require('fs');

class FileWatcher extends events.EventEmitter {
	constructor(path) {
		super();
		this.path = path;
		this.files = this.getDirectoryFiles();
		setInterval(() => this.watchForNewFile(), 1000);
	}

	getDirectoryFiles() {
		return fs.readdirSync(this.path);
	}

	watchForNewFile() {
		const newFiles = this.getDirectoryFiles(this.path);
		newFiles.forEach(file => {
			if (!this.files.includes(file)) {
				this.files = newFiles;
				this.emit('newFile', file);
			}
		});
	}
}

module.exports = FileWatcher;
