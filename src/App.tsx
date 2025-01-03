import { useState, useEffect } from 'react';
import { Task, CreateTaskInput } from '@/types/task';
import { TaskList } from '@/components/TaskList';
import { TaskForm } from '@/components/TaskForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { ListTodo } from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error fetching tasks',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    setTasks(data || []);
  };

  const handleCreateTask = async (data: CreateTaskInput) => {
    const { error } = await supabase.from('tasks').insert([
      {
        ...data,
        user_id: user?.id,
      },
    ]);

    if (error) {
      toast({
        title: 'Error creating task',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Task created',
      description: 'Your task has been created successfully.',
    });

    setIsFormOpen(false);
    fetchTasks();
  };

  const handleUpdateTask = async (data: CreateTaskInput) => {
    if (!editingTask) return;

    const { error } = await supabase
      .from('tasks')
      .update(data)
      .eq('id', editingTask.id);

    if (error) {
      toast({
        title: 'Error updating task',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Task updated',
      description: 'Your task has been updated successfully.',
    });

    setIsFormOpen(false);
    setEditingTask(undefined);
    fetchTasks();
  };

  const handleDeleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if (error) {
      toast({
        title: 'Error deleting task',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Task deleted',
      description: 'Your task has been deleted successfully.',
    });

    fetchTasks();
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				<header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
					<div className="flex items-center gap-2">
						<ListTodo className="h-8 w-8" />
						<h1 className="text-2xl sm:text-3xl font-bold">
							Task Tracker
						</h1>
					</div>
					<div className="flex items-center gap-4 flex-wrap justify-center">
						<span className="text-sm text-muted-foreground order-2 sm:order-1">
							{user?.email}
						</span>
						<Button
							onClick={() => setIsFormOpen(true)}
							className="border-1 sm:order-2"
						>
							Add Task
						</Button>
						<Button
							variant="outline"
							onClick={() => supabase.auth.signOut()}
							className="order-3"
						>
							Sign Out
						</Button>
					</div>
				</header>

				<TaskList
					tasks={tasks}
					onEdit={handleEditTask}
					onDelete={handleDeleteTask}
				/>

				<Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>
								{editingTask ? 'Edit Task' : 'Create Task'}
							</DialogTitle>
						</DialogHeader>
						<TaskForm
							task={editingTask}
							onSubmit={
								editingTask
									? handleUpdateTask
									: handleCreateTask
							}
							onCancel={() => {
								setIsFormOpen(false);
								setEditingTask(undefined);
							}}
						/>
					</DialogContent>
				</Dialog>
			</div>
		</div>
  );
}