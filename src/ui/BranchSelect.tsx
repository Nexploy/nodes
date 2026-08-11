'use client';

import { useNodeResource } from '@nexploy/nodes/ui/adapter';
import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { GitBranch } from '@nexploy/nodes/core/hostResponses';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@nexploy/nodes/vendor/ui/components/form';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@nexploy/nodes/vendor/ui/components/select';
import { GitBranchIcon } from 'lucide-react';

interface RepositoryGitMeta {
    gitProvider: string;
    gitAccountId: string | null;
    gitId: string;
    name: string;
    branch: string;
    repositoryUrl: string;
}

interface BranchState {
    repo: RepositoryGitMeta | undefined;
    branches: GitBranch[] | undefined;
    currentBranch: string | undefined;
}

const BRANCH_ISSUES: { key: string; matches: (state: BranchState) => boolean }[] = [
    { key: 'branchRepoUnavailable', matches: ({ repo }) => !repo },
    { key: 'branchNoGitAccount', matches: ({ repo }) => !!repo && !repo.gitAccountId },
    { key: 'branchLoadFailed', matches: ({ repo, branches }) => !!repo?.gitAccountId && !branches },
    { key: 'branchEmpty', matches: ({ branches }) => branches?.length === 0 },
    {
        key: 'branchNotExist',
        matches: ({ branches, currentBranch }) =>
            !!currentBranch && !!branches?.length && !branches.some((branch) => branch.name === currentBranch),
    },
];

function branchesUrl(repo: RepositoryGitMeta | undefined): string | null {
    if (!repo?.gitAccountId) return null;

    const [owner, repoName] = repo.name.split('/');
    const query = new URLSearchParams({
        provider: repo.gitProvider,
        gitAccountId: repo.gitAccountId,
        repoId: repo.gitId,
        owner: owner ?? '',
        repoName: repoName ?? '',
        repositoryUrl: repo.repositoryUrl,
    });

    return `/api/git/branches?${query.toString()}`;
}

export function BranchSelect({
    name,
    label,
    autoSelectFirst = false,
}: {
    name: string;
    label: string;
    autoSelectFirst?: boolean;
}) {
    const t = useTranslations('repository.pipeline.config');
    const form = useFormContext();
    const params = useParams<{ repositoryId: string }>();

    const { data: repo, isLoading: isLoadingRepo } = useNodeResource<RepositoryGitMeta>(
        `/api/repositories/${params.repositoryId}`,
    );
    const { data: branches, isLoading: isLoadingBranches } = useNodeResource<GitBranch[]>(branchesUrl(repo));

    const currentBranch = form.getValues(name);

    useEffect(() => {
        if (autoSelectFirst && branches?.length && !currentBranch) {
            form.setValue(name, branches[0]?.name);
        }
    }, [branches]);

    const isSettled = !isLoadingRepo && !isLoadingBranches;
    const isBranchExist = !!branches?.some((branch) => branch.name === currentBranch);
    const issue = isSettled
        ? BRANCH_ISSUES.find(({ matches }) => matches({ repo, branches, currentBranch }))
        : undefined;

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <Select {...field} onValueChange={field.onChange} disabled={!isSettled || !branches?.length}>
                        <FormControl>
                            <SelectTrigger>
                                {isLoadingRepo ? (
                                    <span className="text-muted-foreground">{t('repoLoading')}</span>
                                ) : isLoadingBranches ? (
                                    <span className="text-muted-foreground">{t('branchLoading')}</span>
                                ) : isBranchExist ? (
                                    <SelectValue placeholder={t('branchSelect')} />
                                ) : (
                                    <span className="text-muted-foreground">{currentBranch || t('branchSelect')}</span>
                                )}
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>{label}</SelectLabel>
                                {branches?.map((branch) => (
                                    <SelectItem key={branch.name} value={branch.name}>
                                        <div className="flex items-center gap-2">
                                            <GitBranchIcon />
                                            {branch.name}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {issue && <FormDescription>{t(issue.key)}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
