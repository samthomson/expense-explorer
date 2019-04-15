import * as path from 'path'
import * as fs from 'fs'

const main  = async () => {
	// @ts-ignore
	console.log('\nimporter script\n\n')

	// get path of file to import
	const sImportDir: string =  path.resolve(path.dirname(__filename), 'data')
	const asFiles: string[] = fs.readdirSync(sImportDir)

	if (asFiles.length < 1) {
		console.log('no data files to import')
		return
	}
	const sImportFile: string = path.resolve(sImportDir, asFiles[0])
	console.log('import: ', sImportFile)
}

main()
