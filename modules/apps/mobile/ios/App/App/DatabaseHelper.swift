import Foundation

class DatabaseHelper {
    /// Copies a database from the app's bundle to the Library directory
    /// - Parameters:
    ///   - sourceFileName: Name of the source database file in the app's bundle
    ///   - destinationFileName: Name of the destination file in the Library directory
    /// - Returns: Boolean indicating whether the copy was successful
    static func copyDatabaseIfNeeded(
        sourceFileName: String,
        destinationFileName: String
    ) -> Bool {
        let fileManager = FileManager.default
        
        // Construct paths
        guard let documentsDirectory = fileManager.urls(for: .libraryDirectory, in: .userDomainMask).first else {
            print("Error: Could not access Library directory")
            return false
        }
        
        let destinationPath = documentsDirectory.appendingPathComponent(destinationFileName)
        
        // Check if database already exists in Library directory
        if fileManager.fileExists(atPath: destinationPath.path) {
            print("Database already exists in Library directory")
            return true
        }
        
        // Get source file from bundle
        guard let sourcePath = Bundle.main.path(forResource: sourceFileName, ofType: "db") else {
            print("Error: Source database file not found in bundle")
            return false
        }
        
        do {
            // Attempt to copy the file
            try fileManager.copyItem(atPath: sourcePath, toPath: destinationPath.path)
            print("Database successfully copied to Library directory")
            return true
        } catch {
            print("Error copying database: \(error.localizedDescription)")
            return false
        }
    }
    
    func setupDatabase() {
        let _ = DatabaseHelper.copyDatabaseIfNeeded(
            sourceFileName: "dictionary",
            destinationFileName: "LocalDatabase/dictionary.db"
        )
        let _ = DatabaseHelper.copyDatabaseIfNeeded(
            sourceFileName: "tracks",
            destinationFileName: "LocalDatabase/tracks.db"
        )
        let _ = DatabaseHelper.copyDatabaseIfNeeded(
            sourceFileName: "index",
            destinationFileName: "LocalDatabase/index.db"
        )
    }
}
