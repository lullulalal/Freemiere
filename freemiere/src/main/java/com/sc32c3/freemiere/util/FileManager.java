package com.sc32c3.freemiere.util;

import java.awt.Dimension;
import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;

import com.sc32c3.freemiere.vo.FileFolder;
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
	}
	
	public static void findFolderVoRecursive(String path, int pid, ArrayList<FolderVo> folderList)
	{
		File file = new File (path);	
		File[] files = file.listFiles();
		int fNum = 1;
		for( int i = 0; i < files.length; ++i )
		{
			if ( files[i].isDirectory() ) {
				if( ".thumb".equals(files[i].getName()) )
					continue;
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
	public static void getAllSubFile(String path, ArrayList<File> list)
	   {
		
	      File file = new File (path); 
	     
	     System.out.println("파일매니저"+path);
	       if ( !file.isDirectory() ) {
		            list.add(file);
		            return;
		   }else{
			   list.add(file);
		   }
	       File[] files = file.listFiles();
	      for( int i = 0; i < files.length; ++i )
	      {
	         if ( files[i].isDirectory() ) {
	            getAllSubFile( files[i].getAbsolutePath() , list);
	         }
	         else {
	            list.add(files[i]);
	            continue;
	         }
	      }
	   }
}

