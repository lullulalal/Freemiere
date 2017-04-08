package com.sc32c3.freemiere.util;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;

import com.sc32c3.freemiere.vo.FolderVo;

/**
 * 
 * @author minsu
 *
 */
public class FileManager {
	
	public static String[] findByExtension(String path, String ext)
	{
		File file = new File (path);	
		
		String[] files = file.list( (File dir, String name) -> { 
			boolean rst = false;
			File f = new File(dir + "/" + name);
			if ( f.isFile() ) {
					int idx = name.lastIndexOf(("."));
					String extIn = name.substring(idx + 1);
					if (ext.equalsIgnoreCase(extIn))
						rst = true;
				}
			return rst;
			} );
		
		return files;
	}
	
	public static void fileSort(File[] files)
	{
		Arrays.sort(files, (first, second) -> {
			if (first.isDirectory() && second.isFile())
				return 1;
			else if (first.isFile() && second.isDirectory() )
				return -1;
			else
				return 0;
		});
	}
	
	public static File[] findFile(String path)
	{
		File file = new File (path);	
		File[] files = file.listFiles();
		return files;
		//for( File f : files )
		//{
		//	if ( f.isDirectory() ) {
		//		result.add(f);
				//if(isRecursive == true)
				//	findFileRecursive( f.getAbsolutePath() , result, isRecursive );
		//	}
		//	else 
		//		result.add(f);
		//}
	}
	
	public static void findFolderVoRecursive(String path, int pid, ArrayList<FolderVo> folderList)
	{
		File file = new File (path);	
		File[] files = file.listFiles();
		int fNum = 1;
		for( int i = 0; i < files.length; ++i )
		{
			if ( files[i].isDirectory() ) {
				
				int id = Integer.parseInt( Integer.toString(pid) + Integer.toString(fNum) );

				FolderVo nfv = new FolderVo( files[i].getAbsolutePath(), 
									id, pid, files[i].getName(), 
									true, false );
				
				folderList.add(nfv);
				findFolderVoRecursive( files[i].getAbsolutePath() , id, folderList );
				fNum++;
			}
			else 
				continue;
		}
	}
}
