import Mustache from 'mustache'
import path from 'path'
import fs from 'fs'

export default class MdCliTemplate {
  process(properties, destinationPath = process.cwd()) {
    let templateDir = path.join(__dirname, '..', 'templates', properties.template)
    if (!fs.existsSync(templateDir)) {
      console.error(`Template ${properties.template} doesn't exist`)
      return
    }

    let filesAndDirs = walkSync(templateDir)

    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath)
    }

    filesAndDirs.dirs.forEach((dir) => {
      let dirDest = path.join(destinationPath, dir.replace(templateDir, ''))
      dirDest = Mustache.render(dirDest, properties)
      console.log('Creating dir ' + dirDest)
      if (!fs.existsSync(dirDest)) {
        fs.mkdirSync(dirDest);
      }
    })

    filesAndDirs.files.forEach((file) => {
        let fileDest = path.join(destinationPath, file.replace(templateDir, ''))
        fileDest = Mustache.render(fileDest, properties)
        let results = this.processFile(file, properties)
        if (!fs.existsSync(fileDest)) {
          console.log(`Creating file ${fileDest}`)
          fs.writeFileSync(fileDest, results, 'utf-8')
        } else {
          console.warn(`WARNING: File ${fileDest} already exist, it will NOT be overriden`)
        }

      }
    )
  }

  processFile(path, properties) {
    let template = fs.readFileSync(path, "utf8");
    let results = Mustache.render(template, properties)
    return results
  }
}


const walkSync = (dir, filelist = [], dirList = []) => {
  fs.readdirSync(dir).forEach(file => {

    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      let ws = walkSync(path.join(dir, file), filelist, dirList.concat(path.join(dir, file)))
      filelist = ws.files
      dirList = ws.dirs
    } else {
      filelist = filelist.concat(path.join(dir, file))
    }

    // filelist = fs.statSync(path.join(dir, file)).isDirectory()
    //   ? walkSync(path.join(dir, file), filelist, dirList).files
    //   : filelist.concat(path.join(dir, file))

  })
  return {
    dirs: dirList,
    files: filelist
  }
}
